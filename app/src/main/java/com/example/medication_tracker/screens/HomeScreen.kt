package com.example.medication_tracker.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.medication_tracker.components.MedicineCard
import com.example.medication_tracker.components.MedicineForm
import com.example.medication_tracker.components.StatsOverview
import com.example.medication_tracker.model.MealType
import com.example.medication_tracker.viewmodel.HomeViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(viewModel: HomeViewModel = viewModel()) {
    val medsTaken by viewModel.medsTaken.collectAsState()
    val totalMeds = viewModel.countAllMeds(medsTaken)
    val takenMeds = viewModel.countTakenMeds(medsTaken)
    val progressValue = if (totalMeds > 0) takenMeds / totalMeds.toFloat() else 0f
    val topMeds = viewModel.computeTopMeds(medsTaken)

    var showMedicineForm by remember { mutableStateOf(false) }
    var selectedMeal by remember { mutableStateOf(MealType.Desayuno) }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(title = { Text("Agenda") })
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = { showMedicineForm = true },
                icon = { Icon(Icons.Filled.Add, contentDescription = "Añadir") },
                text = { Text("Añadir Medicamento") }
            )
        }
    ) { padding ->
        LazyColumn(modifier = Modifier.padding(padding)) {
            item {
                StatsOverview(
                    progress = progressValue,
                    medsTaken = takenMeds,
                    medsTotal = totalMeds,
                    topMeds = topMeds
                )
            }
            MealType.entries.forEach { meal ->
                item {
                    MealCard(
                        meal = meal,
                        meds = medsTaken[meal] ?: emptyMap(),
                        onToggleMed = viewModel::toggleMedicine,
                        onRemoveMed = viewModel::removeMedicine,
                        onAddMed = {
                            selectedMeal = meal
                            showMedicineForm = true
                        }
                    )
                }
            }
        }
    }

    if (showMedicineForm) {
        MedicineForm(
            meal = selectedMeal,
            onDismiss = { showMedicineForm = false },
            onSave = { medData ->
                viewModel.saveMedicine(medData, selectedMeal)
                showMedicineForm = false
            }
        )
    }
}

@Composable
fun MealCard(
    meal: MealType,
    meds: Map<String, Boolean>,
    onToggleMed: (MealType, String) -> Unit,
    onRemoveMed: (MealType, String) -> Unit,
    onAddMed: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(text = meal.name, style = MaterialTheme.typography.titleLarge)
            Spacer(Modifier.height(8.dp))
            meds.forEach { (med, taken) ->
                MedicineCard(
                    name = med,
                    taken = taken,
                    onClick = { onToggleMed(meal, med) },
                    onDelete = { onRemoveMed(meal, med) }
                )
            }
            Button(onClick = onAddMed, modifier = Modifier.padding(top = 8.dp)) {
                Text("+ Añadir Medicamento")
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun HomeScreenPreview() {
    HomeScreen()
}
