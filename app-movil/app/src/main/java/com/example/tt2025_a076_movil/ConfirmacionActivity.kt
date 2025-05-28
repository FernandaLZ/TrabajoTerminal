package com.example.tt2025_a076_movil

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.tt2025_a076_movil.data.ConfirmacionRepository
import com.example.tt2025_a076_movil.databinding.ActivityConfirmacionBinding

class ConfirmacionActivity : AppCompatActivity() {

    private lateinit var binding: ActivityConfirmacionBinding
    private val repository = ConfirmacionRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityConfirmacionBinding.inflate(layoutInflater)
        setContentView(binding.root)

    }
    override fun onResume() {
        super.onResume()

        repository.obtenerDoctoresConPermisoSolicitado(
            onSuccess = { listaDoctores ->
                binding.rvDoctors.layoutManager = LinearLayoutManager(this)
                binding.rvDoctors.adapter = DoctorAdapter(
                    listaDoctores,
                    onDoctorSelected = { selectedDoctor ->
                        val intent = Intent(this, ConfirmDoctorActivity::class.java)
                        intent.putExtra("DOCTOR_NAME", selectedDoctor.nombreCompleto)
                        intent.putExtra("DOCTOR_UID", selectedDoctor.uid)
                        startActivity(intent)
                    },
                    onDoctorRejected = { rejectedDoctor ->
                        Toast.makeText(this, "Doctor rechazado: ${rejectedDoctor.nombreCompleto}", Toast.LENGTH_SHORT).show()
                        // Aquí podrías manejar lógica de rechazo si lo deseas
                        repository.rechazarPermiso(
                            idDoctor = rejectedDoctor.uid,
                            onSuccess = {
                                Toast.makeText(this, "Permiso rechazado para: ${rejectedDoctor.nombreCompleto}", Toast.LENGTH_SHORT).show()
                                finish()
                            },
                            onFailure = { e ->
                                Toast.makeText(this, "Error al rechazar permiso: ${e.message}", Toast.LENGTH_SHORT).show()
                            }
                        )
                    }
                )
            },
            onFailure = { err ->
                Toast.makeText(this, "Error $err", Toast.LENGTH_LONG).show()
            }
        )
    }

}
