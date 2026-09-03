import math

# Средний уровень №8
seconds = 7384

hours = seconds // 3600
minutes = (seconds % 3600) // 60
seconds_left = seconds % 60

print("Средний уровень №8")
print("Часов:", hours)
print("Минут:", minutes)
print("Секунд:", seconds_left)

print()

# Повышенный уровень №16
a = 3
b = 4
c = 5

p = (a + b + c) / 2
S = math.sqrt(p * (p - a) * (p - b) * (p - c))

print("Повышенный уровень №16")
print("Полупериметр:", p)
print("Площадь:", S)