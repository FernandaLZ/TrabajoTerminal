package com.example.tt2025_a076_movil

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.tt2025_a076_movil.databinding.ActivityRecetaBinding

class RecetaActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRecetaBinding
    private val recetas = listOf(
        "Receta 1: Paracetamol 500mg",
        "Receta 2: Ibuprofeno 200mg",
        "Receta 3: Amoxicilina 250mg",
        "Receta 4: Clorfenamina 4mg",
        "Receta 5: Naproxeno 250mg"
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRecetaBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Configurar RecyclerView
        binding.rvRecetas.layoutManager = LinearLayoutManager(this)
        binding.rvRecetas.adapter = RecetaAdapter(recetas)
    }
}
