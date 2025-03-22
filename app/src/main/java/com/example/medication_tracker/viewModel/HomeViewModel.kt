package com.example.medication_tracker.viewmodel

import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.medication_tracker.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.time.LocalDate

@RequiresApi(Build.VERSION_CODES.O)
class HomeViewModel : ViewModel() {

    private val _treatments = MutableStateFlow<List<Treatment>>(emptyList())
    val treatments: StateFlow<List<Treatment>> = _treatments

    private val _medsTaken = MutableStateFlow<MedicineList>(
        MealType.entries.associateWith { mutableMapOf<String, Boolean>() }
    )
    val medsTaken: StateFlow<MedicineList> = _medsTaken

    init {
        loadItemsForDay(LocalDate.now())
    }

    fun loadItemsForDay(day: LocalDate) {
        viewModelScope.launch {
            try {
                // Aquí deberías hacer un fetch real a tu API.
                // Simulación de tratamiento:
                val simulatedResponse = listOf(
                    Treatment(
                        name = "Ibuprofeno",
                        dose = 400,
                        meals = mapOf(
                            MealType.Desayuno to true,
                            MealType.Comida to false,
                            MealType.Cena to true
                        ),
                        startDate = day.minusDays(2),
                        duration = 10
                    )
                )
                _treatments.value = simulatedResponse
                _medsTaken.value = buildMedicineList(simulatedResponse)
            } catch (e: Exception) {
                Log.e("HomeViewModel", "Error al cargar tratamientos", e)
            }
        }
    }

    private fun buildMedicineList(treatments: List<Treatment>): MedicineList {
        val list = MealType.entries.associateWith { mutableMapOf<String, Boolean>() }
        treatments.forEach { treatment ->
            treatment.meals.forEach { (meal, isActive) ->
                if (isActive) {
                    list[meal]?.set(treatment.name, false)
                }
            }
        }
        return list
    }

    fun toggleMedicine(meal: MealType, med: String) {
        _medsTaken.update { current ->
            val updated = current.toMutableMap()
            val updatedMeal = updated[meal]?.toMutableMap() ?: mutableMapOf()
            updatedMeal[med] = !(updatedMeal[med] ?: false)
            updated[meal] = updatedMeal
            updated
        }
    }

    fun removeMedicine(meal: MealType, med: String) {
        _medsTaken.update { current ->
            val updated = current.toMutableMap()
            updated[meal]?.remove(med)
            updated
        }
    }

    fun countAllMeds(meds: MedicineList): Int =
        meds.values.sumOf { it.size }

    fun countTakenMeds(meds: MedicineList): Int =
        meds.values.sumOf { it.values.count { taken -> taken } }

    fun computeTopMeds(meds: MedicineList): List<Pair<String, Int>> {
        return meds.values
            .flatMap { it.entries }
            .filter { it.value }
            .groupingBy { it.key }
            .eachCount()
            .toList()
            .sortedByDescending { it.second }
    }

    fun saveMedicine(data: Map<String, Any>, meal: MealType) {
        viewModelScope.launch {
            try {
                Log.i("ViewModel", "Guardando medicamento: $data")

                // Aquí iría la llamada real a tu API con Retrofit o fetch
                val name = data["name"] as? String ?: return@launch

                // Añadimos directamente a la UI como simulado
                _medsTaken.update { current ->
                    val updated = current.toMutableMap()
                    val mealMap = updated[meal]?.toMutableMap() ?: mutableMapOf()
                    mealMap[name] = false
                    updated[meal] = mealMap
                    updated
                }

            } catch (e: Exception) {
                Log.e("HomeViewModel", "Error al guardar medicamento", e)
            }
        }
    }
}
