import random

def generate_boolean_function(n):
    # Количество возможных комбинаций входных значений
    num_combinations = 2 ** n

    # Создаем список для хранения значений булевой функции
    boolean_function = [random.randint(0, 1) for _ in range(num_combinations)]

    return boolean_function

def print_truth_table(n, boolean_function):
    num_combinations = 2 ** n # Количество возможных комбинаций входных значений
    print("Таблица истинности для булевой функции:")
    for i in range(num_combinations):
        binary = bin(i)[2:].zfill(n) # Преобразуем индекс в двоичное представление
        args = [int(bit) for bit in binary] # Разделяем двоичное представление на отдельные аргументы
        result = boolean_function[i] # Получаем значение функции

        print(f"Вход: {args} -> Выход: {result}")

    # Вывод в f строку     
    result_str = ", ".join(map(str, boolean_function))
    print(f"f = ({result_str})")
    

n = int(input("Введите n: ")) # Количество аргументов
boolean_function = generate_boolean_function(n)
print_truth_table(n, boolean_function)