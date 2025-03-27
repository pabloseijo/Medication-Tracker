package com.example.medication_tracker.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.medication_tracker.components.MedicineCard
import com.example.medication_tracker.components.MedicineForm
import com.example.medication_tracker.components.StatsOverview
import com.example.medication_tracker.model.MealType
import com.example.medication_tracker.viewmodel.HomeViewModel
import java.time.LocalDate
import java.time.YearMonth
import java.time.format.TextStyle
import java.util.*

@Composable
fun ExpandableCalendar(
    selectedDate: LocalDate,
    onDateSelected: (LocalDate) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    Column {
        DateSelectorRow(
            selectedDate = selectedDate,
            onDateSelected = onDateSelected,
            onExpandToggle = { expanded = !expanded }
        )

        AnimatedVisibility(visible = expanded) {
            FullMonthCalendar(
                selectedDate = selectedDate,
                onDateSelected = {
                    onDateSelected(it)
                    expanded = false
                }
            )
        }
    }
}

@Composable
fun DateSelectorRow(
    selectedDate: LocalDate,
    onDateSelected: (LocalDate) -> Unit,
    onExpandToggle: () -> Unit
) {
    val days = remember {
        (0..14).map { offset -> LocalDate.now().plusDays(offset.toLong()) }
    }

    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 8.dp)
    ) {
        LazyRow(modifier = Modifier.weight(1f)) {
            items(days) { date ->
                val selected = date == selectedDate
                val bg = if (selected) Color(0xFF4CAF50) else Color.LightGray
                val textColor = if (selected) Color.White else Color.Black

                Column(
                    modifier = Modifier
                        .padding(horizontal = 6.dp, vertical = 8.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(bg)
                        .clickable { onDateSelected(date) }
                        .padding(10.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(text = date.dayOfMonth.toString(), color = textColor, fontWeight = FontWeight.Bold)
                    Text(
                        text = date.dayOfWeek.getDisplayName(TextStyle.SHORT, Locale.getDefault()),
                        fontSize = 12.sp,
                        color = textColor
                    )
                }
            }
        }

        IconButton(onClick = onExpandToggle) {
            Icon(Icons.Filled.ExpandMore, contentDescription = "Expand Calendar")
        }
    }
}

@Composable
fun FullMonthCalendar(
    selectedDate: LocalDate,
    onDateSelected: (LocalDate) -> Unit
) {
    val currentMonth = remember { YearMonth.from(LocalDate.now()) }
    val firstOfMonth = currentMonth.atDay(1)
    val lastOfMonth = currentMonth.atEndOfMonth()
    val days = (0 until firstOfMonth.dayOfWeek.value % 7).map { null } + // Padding inicio
            (1..lastOfMonth.dayOfMonth).map { currentMonth.atDay(it) }

    Column(modifier = Modifier.padding(horizontal = 16.dp)) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            listOf("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat").forEach {
                Text(text = it, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }

        days.chunked(7).forEach { week ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                week.forEach { day ->
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (day == selectedDate) Color(0xFF4CAF50) else Color.Transparent)
                            .clickable(enabled = day != null) { day?.let { onDateSelected(it) } },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = day?.dayOfMonth?.toString() ?: "",
                            color = if (day == selectedDate) Color.White else Color.Black
                        )
                    }
                }
            }
        }
    }
}

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
    var selectedDate by remember { mutableStateOf(LocalDate.now()) }

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
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
        ) {
            ExpandableCalendar(
                selectedDate = selectedDate,
                onDateSelected = { selectedDate = it }
            )

            StatsOverview(
                progress = progressValue,
                medsTaken = takenMeds,
                medsTotal = totalMeds,
                topMeds = topMeds
            )

            LazyColumn(
                modifier = Modifier.weight(1f),
                contentPadding = PaddingValues(bottom = 80.dp)
            ) {
                MealType.entries.forEach { meal ->
                    item {
                        MedicineCardList(
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
fun MedicineCardList(
    meal: MealType,
    meds: Map<String, Boolean>,
    onToggleMed: (MealType, String) -> Unit,
    onRemoveMed: (MealType, String) -> Unit,
    onAddMed: () -> Unit
) {
    var recomposeTrigger by remember { mutableStateOf(0) }

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

            meds.entries.forEach { (med, taken) ->
                key(med + recomposeTrigger) {
                    MedicineCard(
                        name = med,
                        taken = taken,
                        onToggleTaken = { onToggleMed(meal, med) },
                        onDelete = {
                            onRemoveMed(meal, med)
                            recomposeTrigger++
                        }
                    )
                }
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
