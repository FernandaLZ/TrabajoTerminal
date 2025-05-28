package com.example.tt2025_a076_movil

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.tt2025_a076_movil.data.RegisterRepository
import com.example.tt2025_a076_movil.databinding.ActivityRegisterBinding
import com.google.firebase.auth.FirebaseAuth



class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding
    private lateinit var auth: FirebaseAuth // 🔐 Instancia de FirebaseAuth
    private val repository = RegisterRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        auth = FirebaseAuth.getInstance() // Inicializa FirebaseAuth

        // Botón para finalizar el registro
        binding.btnRegister.setOnClickListener {
            val firstName = binding.etFirstName.text.toString().trim()
            val lastNamePaterno = binding.etLastNamePaterno.text.toString().trim()
            val lastNameMaterno = binding.etLastNameMaterno.text.toString().trim()
            val phone = binding.etPhone.text.toString().trim()
            val email = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString()

            if (firstName.isEmpty() || lastNamePaterno.isEmpty() || lastNameMaterno.isEmpty()
                || phone.isEmpty() || email.isEmpty() || password.isEmpty()
            ) {
                Toast.makeText(this, "Por favor, completa todos los campos.", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                Toast.makeText(this, "Por favor, ingresa un correo electrónico válido.", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (password.length < 6) {
                Toast.makeText(this, "La contraseña debe tener al menos 6 caracteres.", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val datosExtra = mapOf(
                "nombre" to firstName,
                "apellidoPaterno" to lastNamePaterno,
                "apellidoMaterno" to lastNameMaterno,
                "telefono" to phone
            )

            repository.register(email, password, datosExtra,
                onSuccess = {
                    Toast.makeText(this, "Usuario registrado con éxito.", Toast.LENGTH_SHORT).show()
                    finish()
                },
                onFailure = { error ->
                    Toast.makeText(this, "Error: ${error.message}", Toast.LENGTH_LONG).show()
                })
        }


        // Botón de volver
        binding.btnBack.setOnClickListener {
            finish()
        }
    }
}

