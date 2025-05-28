package com.example.tt2025_a076_movil

import android.Manifest
import android.bluetooth.BluetoothAdapter
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.example.tt2025_a076_movil.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    private val bluetoothPermissions = arrayOf(
        Manifest.permission.BLUETOOTH,
        Manifest.permission.BLUETOOTH_ADMIN,
        Manifest.permission.BLUETOOTH_CONNECT,
        Manifest.permission.BLUETOOTH_SCAN,
        Manifest.permission.ACCESS_FINE_LOCATION
    )

    // Nuevo launcher para habilitar Bluetooth usando API moderna
    private val enableBluetoothLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (result.resultCode == RESULT_OK) {
                Toast.makeText(this, "Bluetooth activado", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Bluetooth no activado", Toast.LENGTH_SHORT).show()
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        checkAndRequestPermissions()
        checkBluetoothEnabled()

        // Botón Gestión y Monitoreo
        binding.btnGestion.setOnClickListener {
            val intent = Intent(this, GestionMonitoreoActivity::class.java)
            startActivity(intent)
        }

        // Botón Ver Recetas
        binding.btnRecetas.setOnClickListener {
            val intent = Intent(this, RecetaActivity::class.java)
            startActivity(intent)
        }

        // Botón Confirmación Doctor
        binding.btnConfirmacion.setOnClickListener {
            val intent = Intent(this, ConfirmacionActivity::class.java)
            startActivity(intent)
        }

        // Botón Cerrar Sesión
        binding.btnLogout.setOnClickListener {
            finish()
        }
    }

    private fun checkAndRequestPermissions() {
        if (bluetoothPermissions.any {
                ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
            }) {
            ActivityCompat.requestPermissions(this, bluetoothPermissions, 1001)
        }
    }

    private fun checkBluetoothEnabled() {
        val bluetoothAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
        if (bluetoothAdapter == null) {
            Toast.makeText(this, "Bluetooth no disponible", Toast.LENGTH_SHORT).show()
        } else {
            if (!bluetoothAdapter.isEnabled) {
                val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
                enableBluetoothLauncher.launch(enableBtIntent)
            }
        }
    }
}
