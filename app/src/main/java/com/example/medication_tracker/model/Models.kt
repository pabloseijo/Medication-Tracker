package com.example.medication_tracker.model

import java.time.LocalDate

data class Treatment(
    val name: String,
    val dose: Int,
    val meals: Map<MealType, Boolean>,
    val startDate: LocalDate,
    val duration: Int
)

typealias MedicineList = Map<MealType, MutableMap<String, Boolean>>

enum class MealType {
    Desayuno, Comida, Cena
}
