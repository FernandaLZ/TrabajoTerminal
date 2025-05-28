package com.example.tt2025_a076_movil.data

import com.google.firebase.auth.FirebaseAuth

class LoginRepository {

    private val auth: FirebaseAuth = FirebaseAuth.getInstance()

    // Función para login
    fun login(
        email: String,
        password: String,
        onSuccess: () -> Unit,
        onFailure: (Exception) -> Unit
    ) {
        auth.signInWithEmailAndPassword(email, password)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener { exception ->
                onFailure(exception)
            }
    }
    fun logout() {
        auth.signOut()
    }
}