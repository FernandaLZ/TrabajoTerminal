package com.example.tt2025_a076_movil.data

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.FieldValue

class RegisterRepository {

    private val auth: FirebaseAuth = FirebaseAuth.getInstance()

    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()

    fun register(
        email: String,
        password: String,
        datosExtra: Map<String, Any>, // Debe incluir nombre, apellidoPaterno, apellidoMaterno
        onSuccess: () -> Unit,
        onFailure: (Exception) -> Unit
    ) {
        auth.createUserWithEmailAndPassword(email, password)
            .addOnSuccessListener { userCredential ->
                val uid = userCredential.user?.uid
                if (uid != null) {
                    val data = HashMap<String, Any>()
                    data["uid"] = uid
                    data["email"] = email
                    data["rol"] = "paciente"
                    data["createdAt"] = FieldValue.serverTimestamp()
                    data.putAll(datosExtra)

                    // Guardar usuario en 'users'
                    firestore.collection("users").document(uid)
                        .set(data)
                        .addOnSuccessListener {
                            // Crear ficha médica con nombre completo y fecha creación
                            val nombre = datosExtra["nombre"] as? String ?: ""
                            val apellidoPaterno = datosExtra["apellidoPaterno"] as? String ?: ""
                            val apellidoMaterno = datosExtra["apellidoMaterno"] as? String ?: ""

                            val nombreCompleto = listOf(nombre, apellidoPaterno, apellidoMaterno)
                                .filter { it.isNotBlank() }
                                .joinToString(" ")

                            val fichaMedicaData = mapOf(
                                "uidPaciente" to uid,
                                "nombreCompleto" to nombreCompleto,
                                "fechaCreacion" to FieldValue.serverTimestamp(),
                                "ultimaModificacion" to FieldValue.serverTimestamp()
                            )

                            firestore.collection("FichaMedica").document(uid)
                                .set(fichaMedicaData)
                                .addOnSuccessListener {
                                    onSuccess()
                                }
                                .addOnFailureListener { exception ->
                                    onFailure(exception)
                                }
                        }
                        .addOnFailureListener { exception ->
                            onFailure(exception)
                        }
                } else {
                    onFailure(Exception("No se obtuvo UID del usuario"))
                }
            }
            .addOnFailureListener { exception ->
                onFailure(exception)
            }
    }
}
