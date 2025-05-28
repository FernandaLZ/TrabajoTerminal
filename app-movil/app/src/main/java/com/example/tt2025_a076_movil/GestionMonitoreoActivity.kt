package com.example.tt2025_a076_movil

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothSocket
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.gridlayout.widget.GridLayout
import com.example.tt2025_a076_movil.databinding.ActivityGestionMonitoreoBinding
import java.io.InputStream
import java.io.OutputStream
import java.util.*
import kotlin.concurrent.thread

class GestionMonitoreoActivity : AppCompatActivity() {

    private lateinit var binding: ActivityGestionMonitoreoBinding
    private var bluetoothSocket: BluetoothSocket? = null
    private val bluetoothAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
    private var inputStream: InputStream? = null
    private var outputStream: OutputStream? = null

    companion object {
        var sharedOutputStream: OutputStream? = null
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityGestionMonitoreoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Botón para conectar Bluetooth
        binding.btnConectarBluetooth.setOnClickListener {
            if (!ensureBluetoothPermissionsOrFinish()) return@setOnClickListener
            showDevicePicker()
        }

        // Botón para enviar comando de prueba
        binding.btnTestSend.setOnClickListener {
            sendTestCommand()
        }

        // Configurar GridLayout dinámicamente
        val rowCount = 7
        val columnCount = 3
        binding.gridCompartments.rowCount = rowCount
        binding.gridCompartments.columnCount = columnCount

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
                        handleCompartmentClick(row * columnCount + col + 1)
                    }
                }
                binding.gridCompartments.addView(button)
            }
        }
    }

    private fun handleCompartmentClick(compartmentNumber: Int) {
        binding.tvTitle.text = "Seleccionaste el compartimento $compartmentNumber"
    }

    private fun hasBluetoothPermissions(): Boolean {
        val permissions = listOf(
            android.Manifest.permission.BLUETOOTH_CONNECT,
            android.Manifest.permission.BLUETOOTH_SCAN
        )
        return permissions.all {
            ContextCompat.checkSelfPermission(this, it) == PackageManager.PERMISSION_GRANTED
        }
    }

    private fun ensureBluetoothPermissionsOrFinish(): Boolean {
        if (!hasBluetoothPermissions()) {
            Toast.makeText(
                this,
                "Permisos Bluetooth requeridos. Intenta desde la pantalla principal.",
                Toast.LENGTH_LONG
            ).show()
            finish()
            return false
        }
        return true
    }

    private fun showDevicePicker() {
        if (!hasBluetoothPermissions()) return

        val pairedDevices: Set<BluetoothDevice>? = bluetoothAdapter?.bondedDevices
        if (pairedDevices.isNullOrEmpty()) {
            Toast.makeText(this, "No hay dispositivos emparejados", Toast.LENGTH_SHORT).show()
            return
        }

        val deviceList = pairedDevices.map { "${it.name} (${it.address})" }
        val deviceArray = deviceList.toTypedArray()

        AlertDialog.Builder(this)
            .setTitle("Selecciona un dispositivo")
            .setItems(deviceArray) { _, which ->
                val device = pairedDevices.elementAt(which)
                connectToDevice(device)
            }
            .show()
    }

    private fun connectToDevice(device: BluetoothDevice) {
        if (!hasBluetoothPermissions()) return

        thread {
            try {
                bluetoothAdapter?.cancelDiscovery()
                val uuid = UUID.fromString("00001101-0000-1000-8000-00805f9b34fb")
                bluetoothSocket = device.createRfcommSocketToServiceRecord(uuid)
                bluetoothSocket?.connect()

                inputStream = bluetoothSocket?.inputStream
                outputStream = bluetoothSocket?.outputStream
                sharedOutputStream = outputStream

                runOnUiThread {
                    Toast.makeText(this, "Conectado a ${device.name}", Toast.LENGTH_SHORT).show()
                }

                listenForData()

            } catch (e: Exception) {
                try {
                    bluetoothSocket?.close()
                } catch (_: Exception) {}

                runOnUiThread {
                    Toast.makeText(this, "Error de conexión: ${e.message}", Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    private fun listenForData() {
        thread {
            try {
                val buffer = ByteArray(1024)
                var bytes: Int

                while (true) {
                    if (!hasBluetoothPermissions()) break
                    bytes = inputStream?.read(buffer) ?: break
                    val message = String(buffer, 0, bytes).trim()
                    runOnUiThread {
                        binding.tvTitle.text = "Dato recibido: $message"
                    }
                }
            } catch (e: Exception) {
                runOnUiThread {
                    Toast.makeText(this, "Error al leer: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun sendTestCommand() {
        thread {
            try {
                outputStream?.write("ACTIVAR:01\n".toByteArray())
                runOnUiThread {
                    Toast.makeText(this, "Comando enviado", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                runOnUiThread {
                    Toast.makeText(this, "Error al enviar: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
