package com.example.tt2025_a076_movil.data

import android.util.Log
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.DocumentReference
import com.google.firebase.firestore.FirebaseFirestore

class ConfirmacionRepository {

    private val auth = FirebaseAuth.getInstance()
    private val firestore = FirebaseFirestore.getInstance()

    fun obtenerDoctoresConPermisoSolicitado(
        onSuccess: (List<DoctorInfo>) -> Unit,
        onFailure: (Exception) -> Unit
    ) {
        val uidPaciente = auth.currentUser?.uid
        if (uidPaciente == null) {
            Log.e("ConfirmacionRepo", "Paciente no autenticado")
            onFailure(Exception("Paciente no autenticado"))
            return
        }

        Log.d("ConfirmacionRepo", "UID del paciente: $uidPaciente")

        firestore.collection("Permisos")
            .whereEqualTo("idPaciente", firestore.document("users/$uidPaciente"))
            .whereEqualTo("permisoSolicitado", true)
            .whereEqualTo("permiso", false)
            .get()
            .addOnSuccessListener { permisosSnapshot ->
                Log.d("ConfirmacionRepo", "Permisos encontrados: ${permisosSnapshot.size()}")

                val doctorRefs = permisosSnapshot.documents.mapNotNull { it.get("idDoctor") as? DocumentReference }

                if (doctorRefs.isEmpty()) {
                    Log.d("ConfirmacionRepo", "No hay doctores referenciados")
                    onSuccess(emptyList())
                    return@addOnSuccessListener
                }

                val listaDoctores = mutableListOf<DoctorInfo>()
                var fetched = 0

                for (ref in doctorRefs) {
                    val doctorId = ref.id
                    firestore.collection("users").document(doctorId)
                        .get()
                        .addOnSuccessListener { doctorDoc ->
                            val nombre = doctorDoc.getString("nombre") ?: ""
                            val apellidoP = doctorDoc.getString("apellidoPaterno") ?: ""
                            val apellidoM = doctorDoc.getString("apellidoMaterno") ?: ""
                            val nombreCompleto = listOf(nombre, apellidoP, apellidoM).joinToString(" ").trim()

                            listaDoctores.add(DoctorInfo(uid = doctorId, nombreCompleto = nombreCompleto))
                            fetched++
                            if (fetched == doctorRefs.size) {
                                onSuccess(listaDoctores)
                            }
                        }
                        .addOnFailureListener {
                            fetched++
                            if (fetched == doctorRefs.size) {
                                onSuccess(listaDoctores)
                            }
                        }
                }
            }
            .addOnFailureListener { e ->
                Log.e("ConfirmacionRepo", "Error al obtener permisos: $e")
                onFailure(e)
            }
    }
    fun aceptarPermiso(
        idDoctor: String,
        onSuccess: () -> Unit,
        onFailure: (Exception) -> Unit
    ) {
        val uidPaciente = auth.currentUser?.uid
        if (uidPaciente == null) {
            Log.e("ConfirmacionRepo", "Paciente no autenticado")
            onFailure(Exception("Paciente no autenticado"))
            return
        }
        val pacienteRef= firestore.document("users/$uidPaciente")
        val doctorRef = firestore.document("users/$idDoctor")

        firestore.collection("Permisos")
            .whereEqualTo("idPaciente", pacienteRef)
            .whereEqualTo("idDoctor", doctorRef)
            .get()
            .addOnSuccessListener { querySnapshot ->
                if (querySnapshot.isEmpty) {
                    onFailure(Exception("No se encontró permiso con los IDs dados"))
                    return@addOnSuccessListener
                }

                val batch = firestore.batch()
                for (doc in querySnapshot.documents) {
                    batch.update(doc.reference, "permiso", true)
                    batch.update(doc.reference, "permisoSolicitado", false)
                }

                batch.commit()
                    .addOnSuccessListener { onSuccess() }
                    .addOnFailureListener { e -> onFailure(e) }
            }
            .addOnFailureListener { e ->
                onFailure(e)
            }
    }
    fun rechazarPermiso(
        idDoctor: String,
        onSuccess: () -> Unit,
        onFailure: (Exception) -> Unit
    ) {
        val uidPaciente = auth.currentUser?.uid
        if (uidPaciente == null) {
            Log.e("ConfirmacionRepo", "Paciente no autenticado")
            onFailure(Exception("Paciente no autenticado"))
            return
        }

        val pacienteRef = firestore.document("users/$uidPaciente")
        val doctorRef = firestore.document("users/$idDoctor")

        firestore.collection("Permisos")
            .whereEqualTo("idPaciente", pacienteRef)
            .whereEqualTo("idDoctor", doctorRef)
            .get()
            .addOnSuccessListener { querySnapshot ->
                if (querySnapshot.isEmpty) {
                    onFailure(Exception("No se encontró permiso con los IDs dados"))
                    return@addOnSuccessListener
                }

                val batch = firestore.batch()
                for (doc in querySnapshot.documents) {
                    batch.update(doc.reference, "permiso", false)
                    batch.update(doc.reference, "permisoSolicitado", false)
                }

                batch.commit()
                    .addOnSuccessListener { onSuccess() }
                    .addOnFailureListener { e -> onFailure(e) }
            }
            .addOnFailureListener { e ->
                onFailure(e)
            }
    }
}

data class DoctorInfo(
    val uid: String,
    val nombreCompleto: String
)
