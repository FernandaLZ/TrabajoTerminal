package com.example.tt2025_a076_movil

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.tt2025_a076_movil.data.LoginRepository
import com.example.tt2025_a076_movil.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val loginRepository = LoginRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Botón Gestión y Monitoreo
        binding.btnGestion.setOnClickListener {
            val intent = Intent(this, GestionMonitoreoActivity::class.java)
            startActivity(intent)
        }

        // Botón Ver Recetas
        binding.btnRecetas.setOnClickListener {
            val intent = Intent(this, RecetaActivity::class.java)
            startActivity(intent)
        }

        // Botón Confirmación Doctor
        binding.btnConfirmacion.setOnClickListener {
            val intent = Intent(this, ConfirmacionActivity::class.java)
            startActivity(intent)
        }

        // Botón Cerrar Sesión
        binding.btnLogout.setOnClickListener {
            loginRepository.logout()
            val intent = Intent(this, LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
        }
    }
}
