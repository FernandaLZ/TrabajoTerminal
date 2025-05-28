package com.example.tt2025_a076_movil

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.tt2025_a076_movil.data.DoctorInfo

class DoctorAdapter(
    private val doctors: List<DoctorInfo>,
    private val onDoctorSelected: (DoctorInfo) -> Unit,
    private val onDoctorRejected: (DoctorInfo) -> Unit
) : RecyclerView.Adapter<DoctorAdapter.DoctorViewHolder>() {

    inner class DoctorViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val doctorName: TextView = itemView.findViewById(R.id.tvDoctorName)
        val selectButton: Button = itemView.findViewById(R.id.btnSelectDoctor)
        val rejectButton: Button = itemView.findViewById(R.id.btnRejectDoctor)

    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DoctorViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_doctor, parent, false)
        return DoctorViewHolder(view)
    }

    override fun onBindViewHolder(holder: DoctorViewHolder, position: Int) {
        val doctor = doctors[position]

        holder.doctorName.text = doctor.nombreCompleto

        holder.selectButton.setOnClickListener {
            onDoctorSelected(doctor)
        }

        holder.rejectButton.setOnClickListener {
            onDoctorRejected(doctor)
        }
    }

    override fun getItemCount(): Int = doctors.size
}
