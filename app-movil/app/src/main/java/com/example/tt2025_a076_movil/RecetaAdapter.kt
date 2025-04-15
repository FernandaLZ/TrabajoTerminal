package com.example.tt2025_a076_movil

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class RecetaAdapter(private val recetas: List<String>) :
    RecyclerView.Adapter<RecetaAdapter.RecetaViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecetaViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_receta, parent, false)
        return RecetaViewHolder(view)
    }

    override fun onBindViewHolder(holder: RecetaViewHolder, position: Int) {
        holder.bind(recetas[position])
    }

    override fun getItemCount(): Int = recetas.size

    class RecetaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tvReceta: TextView = itemView.findViewById(R.id.tvReceta)
        fun bind(receta: String) {
            tvReceta.text = receta
        }
    }
}
