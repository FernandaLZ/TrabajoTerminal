package com.example.tt2025_a076_movil

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.tt2025_a076_movil.databinding.ActivityConfirmDoctorBinding

class ConfirmDoctorActivity : AppCompatActivity() {

    private lateinit var binding: ActivityConfirmDoctorBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityConfirmDoctorBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Mostrar el nombre del doctor seleccionado
        val doctorName = intent.getStringExtra("DOCTOR_NAME")
        binding.tvDoctorConfirmation.text = getString(R.string.confirm_doctor_message, doctorName)

        // Confirmar selección
        binding.btnConfirm.setOnClickListener {
            // Aquí puedes agregar lógica para enviar la confirmación al servidor
            finish()
        }
    }
}
