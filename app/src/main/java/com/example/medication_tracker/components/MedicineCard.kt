package com.example.medication_tracker.components
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MedicineCard(
    name: String,
    taken: Boolean,
    onToggleTaken: () -> Unit,
    onDelete: () -> Unit
) {
    val cardHeight = remember { mutableStateOf(0) }

    val dismissState = rememberSwipeToDismissBoxState(
        confirmValueChange = {
            if (it == SwipeToDismissBoxValue.EndToStart) {
                onDelete()
                true
            } else false
        },
        positionalThreshold = { it * 0.25f }
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp, vertical = 4.dp) // Padding común para ambos
    ) {
        SwipeToDismissBox(
            state = dismissState,
            enableDismissFromEndToStart = true,
            backgroundContent = {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(with(LocalDensity.current) { cardHeight.value.toDp() })
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFFEF4444)),
                    contentAlignment = Alignment.CenterEnd
                ) {
                    Text(
                        text = "Borrar",
                        color = Color.White,
                        fontSize = 18.sp,
                        modifier = Modifier.padding(end = 20.dp)
                    )
                }
            },
            content = {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .onGloballyPositioned {
                            cardHeight.value = it.size.height
                        },
                    shape = RoundedCornerShape(12.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = taken,
                            onCheckedChange = { onToggleTaken() }
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = name,
                            style = MaterialTheme.typography.bodyLarge,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        )
    }
}
