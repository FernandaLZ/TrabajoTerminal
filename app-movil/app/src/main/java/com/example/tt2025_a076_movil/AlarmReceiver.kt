package com.example.tt2025_a076_movil

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.widget.Toast
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import java.io.OutputStream

class AlarmReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val outputStream = GestionMonitoreoActivity.sharedOutputStream

        // Notificación previa
        val notification = NotificationCompat.Builder(context, "alarm_channel")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle("Pastilla")
            .setContentText("¡Toma la pastilla del compartimento 1!")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        NotificationManagerCompat.from(context).notify(1, notification)

        // Enviar comando al ESP32
        try {
            outputStream?.write("ACTIVAR:01\n".toByteArray())
        } catch (e: Exception) {
            Toast.makeText(context, "Error al enviar al ESP32", Toast.LENGTH_SHORT).show()
        }
    }
}
