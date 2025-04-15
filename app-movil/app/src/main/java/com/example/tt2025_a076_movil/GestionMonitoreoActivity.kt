package com.example.tt2025_a076_movil

import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import androidx.gridlayout.widget.GridLayout
import com.example.tt2025_a076_movil.databinding.ActivityGestionMonitoreoBinding

class GestionMonitoreoActivity : AppCompatActivity() {

    private lateinit var binding: ActivityGestionMonitoreoBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityGestionMonitoreoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Configurar GridLayout dinámicamente
        val rowCount = 7
        val columnCount = 3
        binding.gridCompartments.rowCount = rowCount
        binding.gridCompartments.columnCount = columnCount

        // Crear botones para los compartimentos
        for (row in 0 until rowCount) {
            for (col in 0 until columnCount) {
                val button = Button(this).apply {
                    text = "C${row * columnCount + col + 1}"
                    layoutParams = GridLayout.LayoutParams().apply {
                        rowSpec = GridLayout.spec(row)
                        columnSpec = GridLayout.spec(col)
                        width = GridLayout.LayoutParams.WRAP_CONTENT
                        height = GridLayout.LayoutParams.WRAP_CONTENT
                        setMargins(8, 8, 8, 8)
                    }
                    setOnClickListener {
                        // Manejo del clic en cada compartimento
                        handleCompartmentClick(row * columnCount + col + 1)
                    }
                }
                binding.gridCompartments.addView(button)
            }
        }
    }

    private fun handleCompartmentClick(compartmentNumber: Int) {
        // Muestra un mensaje temporal al hacer clic
        binding.tvTitle.text = "Seleccionaste el compartimento $compartmentNumber"
    }
}
