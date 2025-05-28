package com.example.tt2025_a076_movil

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.tt2025_a076_movil.data.ConfirmacionRepository
import com.example.tt2025_a076_movil.databinding.ActivityConfirmDoctorBinding

class ConfirmDoctorActivity : AppCompatActivity() {

    private lateinit var binding: ActivityConfirmDoctorBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityConfirmDoctorBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Mostrar el nombre del doctor seleccionado
        val doctorName = intent.getStringExtra("DOCTOR_NAME")
        val doctorUid = intent.getStringExtra("DOCTOR_UID")

        binding.tvDoctorConfirmation.text = getString(R.string.confirm_doctor_message, doctorName ?: "Doctor")

        // Confirmar selección
        binding.btnConfirm.setOnClickListener {
            val idDoctor = intent.getStringExtra("DOCTOR_UID") ?: return@setOnClickListener

            val repository = ConfirmacionRepository()

            repository.aceptarPermiso(
                idDoctor = idDoctor,
                onSuccess = {
                    Toast.makeText(this, "Permiso aceptado correctamente", Toast.LENGTH_SHORT).show()
                    finish()
                },
                onFailure = { e ->
                    Toast.makeText(this, "Error al aceptar permiso: ${e.message}", Toast.LENGTH_LONG).show()
                }
            )
        }
    }
}
