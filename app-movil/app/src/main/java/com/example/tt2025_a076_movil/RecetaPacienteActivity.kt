package com.example.tt2025_a076_movil;

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.tt2025_a076_movil.data.RecetaRepository
import com.example.tt2025_a076_movil.databinding.ActivityRecetaPacienteBinding
import java.text.SimpleDateFormat
import java.util.Locale

class RecetaPacienteActivity : AppCompatActivity() {

    private lateinit var tvDoctorNombre: TextView
    private lateinit var tvFechaCreacion: TextView
    private lateinit var tvContenidoReceta: TextView
    private lateinit var tvPeso: TextView
    private lateinit var tvTalla: TextView
    private lateinit var tvAlergias: TextView
    private val repository = RecetaRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_receta_paciente)

        tvDoctorNombre = findViewById(R.id.tvDoctorNombre)
        tvFechaCreacion = findViewById(R.id.tvFechaCreacion)
        tvContenidoReceta = findViewById(R.id.tvContenidoReceta)
        tvPeso = findViewById(R.id.tvPeso)
        tvTalla = findViewById(R.id.tvTalla)
        tvAlergias = findViewById(R.id.tvAlergias)

        val recetaId = intent.getStringExtra("RECETA_ID") ?: return

        repository.obtenerRecetaPorId(recetaId,
            onSuccess = { receta ->
                // Nombre del doctor (debes haberlo pasado desde la actividad anterior o traerlo aquí también)
                val nombreDoctor = intent.getStringExtra("DOCTOR_NAME") ?: "Sin nombre"
                tvDoctorNombre.text = "Doctor: $nombreDoctor"

                receta["fechaCreacion"]?.let {
                    val timestamp = it as com.google.firebase.Timestamp
                    val date = timestamp.toDate()

                    // Formatear la fecha a un string legible, por ejemplo: "28 de mayo de 2025"
                    val formato = SimpleDateFormat("dd 'de' MMMM 'de' yyyy", Locale("es", "MX"))
                    val fechaFormateada = formato.format(date)

                    tvFechaCreacion.text = "Fecha de creación: $fechaFormateada"
                }

                receta["receta"]?.let {
                    tvContenidoReceta.text = "Contenido: $it"
                }

                receta["peso"]?.let {
                    tvPeso.text = "Peso: ${it}kg"
                    tvPeso.visibility = TextView.VISIBLE
                } ?: run {
                    tvPeso.visibility = TextView.GONE
                }

                receta["talla"]?.let {
                    tvTalla.text = "Talla: ${it}cm"
                    tvTalla.visibility = TextView.VISIBLE
                } ?: run {
                    tvTalla.visibility = TextView.GONE
                }

                receta["alergias"]?.let { tieneAlergias ->
                    val descripcion = receta["descripcionAlergias"] ?: ""
                    val texto = if (tieneAlergias as Boolean && descripcion.toString().isNotBlank()) {
                        "Alergias: $descripcion"
                    } else if (tieneAlergias) {
                        "Alergias: Sí (sin descripción)"
                    } else {
                        "Alergias: No"
                    }
                    tvAlergias.text = texto
                    tvAlergias.visibility = TextView.VISIBLE
                } ?: run {
                    tvAlergias.visibility = TextView.GONE
                }
            },
            onFailure = { ex ->
                tvContenidoReceta.text = "Error al cargar receta: ${ex.localizedMessage}"
            }
        )
    }
}