package com.example.tt2025_a076_movil.data

import android.util.Log
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import java.util.Date
class RecetaRepository {

    private val auth = FirebaseAuth.getInstance()
    private val firestore = FirebaseFirestore.getInstance()


    fun obtenerRecetasPorPaciente(
        onSuccess: (List<RecetaInfo>) -> Unit,
        onFailure: (Exception) -> Unit
    ) {
        val uidPaciente = auth.currentUser?.uid
        Log.d("RecetaDebug", "UID del paciente: $uidPaciente")

        if (uidPaciente == null) {
            Log.e("RecetaDebug", "Paciente no autenticado")
            onFailure(Exception("Paciente no autenticado"))
            return
        }

        firestore.collection("Recetas")
            .whereEqualTo("uidPaciente", firestore.document("users/$uidPaciente"))
            .get()
            .addOnSuccessListener { recetasSnapshot ->
                Log.d("RecetaDebug", "Recetas encontradas: ${recetasSnapshot.size()}")

                if (recetasSnapshot.isEmpty) {
                    Log.d("RecetaDebug", "No hay recetas para este paciente")
                    onSuccess(emptyList())
                    return@addOnSuccessListener
                }

                val recetasList = mutableListOf<RecetaInfo>()
                var fetched = 0

                for (document in recetasSnapshot.documents) {
                    val idReceta = document.id
                    val idDoctorRef = document.getDocumentReference("uidDoctor")
                    val fechaCreacion = document.getTimestamp("fechaCreacion")
                    val idPacienteRef = document.getDocumentReference("uidPaciente")

                    Log.d("RecetaDebug", "Procesando receta $idReceta con doctor ${idDoctorRef?.id}")
                    Log.d("RecetaDebug", "Procesando receta $idReceta con doctor ${idPacienteRef?.id}")

                    if (idDoctorRef == null || idPacienteRef == null) {
                        Log.e("RecetaDebug", "Referencia nula en doctor o paciente para receta $idReceta")
                        fetched++
                        if (fetched == recetasSnapshot.size()) {
                            Log.d("RecetaDebug", "Finalizando con ${recetasList.size} recetas")
                            onSuccess(recetasList)
                        }
                        continue
                    }

                    firestore.collection("users").document(idDoctorRef.id)
                        .get()
                        .addOnSuccessListener { doctorDoc ->
                            val nombre = doctorDoc.getString("nombre") ?: ""
                            val apellidoP = doctorDoc.getString("apellidoPaterno") ?: ""
                            val apellidoM = doctorDoc.getString("apellidoMaterno") ?: ""
                            val nombreCompletoDoctor = "$nombre $apellidoP $apellidoM".trim()

                            Log.d("RecetaDebug", "Doctor obtenido: $nombreCompletoDoctor")

                            recetasList.add(
                                RecetaInfo(
                                    idReceta = idReceta,
                                    idDoctor = idDoctorRef.id,
                                    idPaciente = idPacienteRef.id,
                                    fechaCreacion = fechaCreacion?.toDate(),
                                    nombreCompletoDoctor = nombreCompletoDoctor
                                )
                            )

                            fetched++
                            if (fetched == recetasSnapshot.size()) {
                                Log.d("RecetaDebug", "Finalizando con ${recetasList.size} recetas")
                                onSuccess(recetasList)
                            }
                        }
                        .addOnFailureListener {
                            Log.e("RecetaDebug", "Error al obtener datos del doctor: ${it.message}")
                            fetched++
                            if (fetched == recetasSnapshot.size()) {
                                onSuccess(recetasList)
                            }
                        }
                }
            }
            .addOnFailureListener { error ->
                Log.e("RecetaDebug", "Error al obtener recetas: ${error.message}")
                onFailure(error)
            }
    }
    fun obtenerRecetaPorId(
        recetaId: String,
        onSuccess: (Map<String, Any>) -> Unit,
        onFailure: (Exception) -> Unit
    ) {
        val recetaRef = firestore.collection("Recetas").document(recetaId)

        recetaRef.get()
            .addOnSuccessListener { documentSnapshot ->
                if (documentSnapshot.exists()) {
                    val recetaData = documentSnapshot.data
                    if (recetaData != null) {
                        Log.d("RecetaDebug", recetaData.toString())
                        onSuccess(recetaData)
                    } else {
                        onFailure(Exception("La receta está vacía"))
                    }
                } else {
                    onFailure(Exception("No se encontró la receta con el ID proporcionado"))
                }
            }
            .addOnFailureListener { exception ->
                Log.e("RecetasRepo", "Error al obtener receta: $exception")
                onFailure(exception)
            }
    }
}
data class RecetaInfo(
    val idReceta: String,
    val idDoctor: String,
    val idPaciente: String,
    val fechaCreacion: Date?,
    val nombreCompletoDoctor: String
)