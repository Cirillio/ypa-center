<script lang="ts" setup>
// Одноразовый салют в цветах кружков для «УРА!»; раскладка детерминирована – одинакова на каждом показе.
const PIECE_COUNT = 28

interface ConfettiPiece {
    id: number
    colorClass: string
    shapeClass: string
    style: Record<string, string>
}

// ПОЧЕМУ без Math.random: разброс по золотому углу ровный и предсказуемый, без «дыр» в салюте
const pieces: ConfettiPiece[] = Array.from({ length: PIECE_COUNT }, (_, i) => {
    const angle = i * 137.5 * (Math.PI / 180)
    const distance = 90 + (i % 5) * 28
    return {
        id: i,
        colorClass: getActivityTheme(i + 1).fullBg,
        shapeClass: i % 3 === 0 ? "size-2.5 rounded-full" : "h-3.5 w-1.5 rounded-xs",
        style: {
            "--x": `${Math.round(Math.cos(angle) * distance * 1.4)}px`,
            "--y": `${Math.round(Math.sin(angle) * distance - 40)}px`,
            "--r": `${(i % 2 ? 1 : -1) * (180 + i * 23)}deg`,
            "--d": `${1.2 + (i % 4) * 0.15}s`,
            "--delay": `${(i % 6) * 0.03}s`
        }
    }
})
</script>

<template>
    <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
    >
        <span
            v-for="piece in pieces"
            :key="piece.id"
            class="confetti-piece absolute"
            :class="[piece.colorClass, piece.shapeClass]"
            :style="piece.style"
        />
    </div>
</template>
