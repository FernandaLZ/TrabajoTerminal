package com.example.tt2025_a076_movil

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.tt2025_a076_movil.databinding.ActivityConfirmacionBinding

class ConfirmacionActivity : AppCompatActivity() {

    private lateinit var binding: ActivityConfirmacionBinding
    private val doctors = listOf("Dr. Juan Pérez", "Dr. María López", "Dr. Carlos Ruiz")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityConfirmacionBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Configurar RecyclerView
        binding.rvDoctors.layoutManager = LinearLayoutManager(this)
        binding.rvDoctors.adapter = DoctorAdapter(doctors) { selectedDoctor ->
            // Navegar a la pantalla de confirmación
            val intent = Intent(this, ConfirmDoctorActivity::class.java)
            intent.putExtra("DOCTOR_NAME", selectedDoctor)
            startActivity(intent)
        }
    }
}
