package com.example.tt2025_a076_movil

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.tt2025_a076_movil.data.RecetaRepository
import com.example.tt2025_a076_movil.databinding.ActivityConfirmacionBinding
import com.example.tt2025_a076_movil.databinding.ActivityRecetaBinding

class RecetaActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRecetaBinding
    private val repository = RecetaRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRecetaBinding.inflate(layoutInflater)
        setContentView(binding.root)
        binding.rvRecetas.layoutManager = LinearLayoutManager(this)
        binding.rvRecetas.adapter = RecetaAdapter(emptyList(), onRecetaSelected = {})

    }
    override fun onResume() {
        super.onResume()
        Log.d("RecetaDebug", "onResume: solicitando recetas")

        repository.obtenerRecetasPorPaciente(
            onSuccess = { listaRecetas ->
                Log.d("RecetaDebug", "Recetas recibidas: ${listaRecetas.size}")
                binding.rvRecetas.adapter = RecetaAdapter(
                    listaRecetas,
                    onRecetaSelected = { selectedReceta ->
                        Log.d("RecetaDebug", "Receta seleccionada: ${selectedReceta.idReceta}")
                        val intent = Intent(this, RecetaPacienteActivity::class.java)
                        intent.putExtra("DOCTOR_NAME", selectedReceta.nombreCompletoDoctor)
                        intent.putExtra("DOCTOR_UID", selectedReceta.idDoctor)
                        intent.putExtra("FECHA_CREACIÓN", selectedReceta.fechaCreacion)
                        intent.putExtra("PACIENTE_UID", selectedReceta.idPaciente)
                        intent.putExtra("RECETA_ID", selectedReceta.idReceta)
                        startActivity(intent)
                    }
                )
            },
            onFailure = { err ->
                Log.e("RecetaDebug", "Error al obtener recetas: ${err.message}")
                Toast.makeText(this, "Error $err", Toast.LENGTH_LONG).show()
            }
        )
    }
}
