package com.example.tt2025_a076_movil

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.tt2025_a076_movil.data.RecetaInfo
import java.text.SimpleDateFormat
import java.util.Locale

class RecetaAdapter(
    private val recetas: List<RecetaInfo>,
    private val onRecetaSelected: (RecetaInfo) -> Unit
) : RecyclerView.Adapter<RecetaAdapter.RecetaViewHolder>() {

    inner class RecetaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvDoctorName: TextView = itemView.findViewById(R.id.tvDoctorName)
        val tvFechaCreacion: TextView = itemView.findViewById(R.id.tvFechaCreacion)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecetaViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_receta, parent, false)
        return RecetaViewHolder(view)
    }

    override fun onBindViewHolder(holder: RecetaViewHolder, position: Int) {
        val receta = recetas[position]

        holder.tvDoctorName.text = receta.nombreCompletoDoctor
        // Formatear fecha
        val sdf = SimpleDateFormat("dd MMM yyyy, HH:mm", Locale.getDefault())
        holder.tvFechaCreacion.text = receta.fechaCreacion?.let { sdf.format(it) } ?: "Sin fecha"

        holder.itemView.setOnClickListener {
            onRecetaSelected(receta)
        }
    }

    override fun getItemCount(): Int = recetas.size
}
