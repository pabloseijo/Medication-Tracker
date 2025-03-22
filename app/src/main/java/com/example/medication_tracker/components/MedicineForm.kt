package com.example.medication_tracker.components

import android.app.DatePickerDialog
import android.widget.DatePicker
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.material3.RadioButton
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.example.medication_tracker.model.MealType
import java.time.LocalDate
import java.util.*

@Composable
fun MedicineForm(
    meal: MealType,
    onDismiss: () -> Unit,
    onSave: (Map<String, Any>) -> Unit
) {
    val context = LocalContext.current

    var medicineType by remember { mutableStateOf("sporadic") }

    // Sporadic
    var sporadicName by remember { mutableStateOf("") }
    var sporadicDose by remember { mutableStateOf("") }

    // Treatment
    var treatmentName by remember { mutableStateOf("") }
    var treatmentDose by remember { mutableStateOf("") }
    var treatmentStartDate by remember { mutableStateOf(LocalDate.now()) }
    var treatmentDuration by remember { mutableStateOf("") }
    var treatmentMeals by remember {
        mutableStateOf(
            mapOf(
                MealType.Desayuno to false,
                MealType.Comida to false,
                MealType.Cena to false
            )
        )
    }

    AlertDialog(
        onDismissRequest = { onDismiss() },
        confirmButton = {
            Button(onClick = {
                val data = if (medicineType == "sporadic") {
                    mapOf(
                        "name" to sporadicName.ifBlank { "Medicamento Desconocido" },
                        "cantidad" to (sporadicDose.toIntOrNull() ?: 1),
                        "moments" to listOf(
                            meal == MealType.Desayuno,
                            meal == MealType.Comida,
                            meal == MealType.Cena
                        ),
                        "inicio" to treatmentStartDate.toString(),
                        "duration_days" to 1
                    )
                } else {
                    mapOf(
                        "name" to treatmentName.ifBlank { "Tratamiento Desconocido" },
                        "cantidad" to (treatmentDose.toIntOrNull() ?: 1),
                        "moments" to listOf(
                            treatmentMeals[MealType.Desayuno] ?: false,
                            treatmentMeals[MealType.Comida] ?: false,
                            treatmentMeals[MealType.Cena] ?: false
                        ),
                        "inicio" to treatmentStartDate.toString(),
                        "duration_days" to (treatmentDuration.toIntOrNull() ?: 1)
                    )
                }

                onSave(data)
            }) {
                Text("Guardar")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancelar")
            }
        },
        title = { Text("Añadir Medicamento") },
        text = {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    RadioButton(
                        selected = medicineType == "sporadic",
                        onClick = { medicineType = "sporadic" }
                    )
                    Text("Toma Esporádica")
                    Spacer(modifier = Modifier.width(16.dp))
                    RadioButton(
                        selected = medicineType == "treatment",
                        onClick = { medicineType = "treatment" }
                    )
                    Text("Tratamiento")
                }

                Spacer(Modifier.height(16.dp))

                if (medicineType == "sporadic") {
                    OutlinedTextField(
                        value = sporadicName,
                        onValueChange = { sporadicName = it },
                        label = { Text("Nombre") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(Modifier.height(8.dp))
                    OutlinedTextField(
                        value = sporadicDose,
                        onValueChange = { sporadicDose = it },
                        label = { Text("Dosis") },
                        keyboardOptions = KeyboardOptions.Default.copy(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(Modifier.height(8.dp))
                    Text("Momento: ${meal.name}")
                } else {
                    OutlinedTextField(
                        value = treatmentName,
                        onValueChange = { treatmentName = it },
                        label = { Text("Nombre") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(Modifier.height(8.dp))
                    OutlinedTextField(
                        value = treatmentDose,
                        onValueChange = { treatmentDose = it },
                        label = { Text("Dosis") },
                        keyboardOptions = KeyboardOptions.Default.copy(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(Modifier.height(8.dp))

                    // Date Picker
                    val calendar = Calendar.getInstance()
                    val datePickerDialog = DatePickerDialog(
                        context,
                        { _: DatePicker, year: Int, month: Int, day: Int ->
                            treatmentStartDate = LocalDate.of(year, month + 1, day)
                        },
                        treatmentStartDate.year,
                        treatmentStartDate.monthValue - 1,
                        treatmentStartDate.dayOfMonth
                    )

                    Button(onClick = { datePickerDialog.show() }) {
                        Text("Fecha de inicio: $treatmentStartDate")
                    }

                    Spacer(Modifier.height(8.dp))
                    Text("Momentos del día:")

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Checkbox(
                            checked = treatmentMeals[MealType.Desayuno] == true,
                            onCheckedChange = {
                                treatmentMeals = treatmentMeals.toMutableMap().apply {
                                    this[MealType.Desayuno] = it
                                }
                            }
                        )
                        Text("Desayuno")
                        Spacer(Modifier.width(8.dp))
                        Checkbox(
                            checked = treatmentMeals[MealType.Comida] == true,
                            onCheckedChange = {
                                treatmentMeals = treatmentMeals.toMutableMap().apply {
                                    this[MealType.Comida] = it
                                }
                            }
                        )
                        Text("Comida")
                        Spacer(Modifier.width(8.dp))
                        Checkbox(
                            checked = treatmentMeals[MealType.Cena] == true,
                            onCheckedChange = {
                                treatmentMeals = treatmentMeals.toMutableMap().apply {
                                    this[MealType.Cena] = it
                                }
                            }
                        )
                        Text("Cena")
                    }

                    Spacer(Modifier.height(8.dp))
                    OutlinedTextField(
                        value = treatmentDuration,
                        onValueChange = { treatmentDuration = it },
                        label = { Text("Duración (días)") },
                        keyboardOptions = KeyboardOptions.Default.copy(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }
    )
}
