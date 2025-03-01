def restore_function(zero_residual, one_residual, arg_index):
    """
    Восстанавливает исходную булеву функцию из нулевой и единичной остаточных функций.

    :param zero_residual: Нулевая остаточная функция (вектор значений при x_i = 0).
    :param one_residual: Единичная остаточная функция (вектор значений при x_i = 1).
    :param arg_index: Номер аргумента (начиная с 0).
    :return: Восстановленный вектор булевой функции.
    """
    n = len(zero_residual).bit_length()  # Определяем количество аргументов
    restored_function = []

    # Количество комбинаций для остаточных функций
    num_combinations = 2 ** (n - 1)

    for i in range(num_combinations * 2):
        # Преобразуем индекс в двоичное представление
        binary = bin(i)[2:].zfill(n)
        # Определяем значение аргумента x_i
        if int(binary[arg_index]) == 0:
            # Используем нулевую остаточную функцию
            residual_index = int(binary[:arg_index] + binary[arg_index + 1:], 2)
            restored_function.append(zero_residual[residual_index])
        else:
            # Используем единичную остаточную функцию
            residual_index = int(binary[:arg_index] + binary[arg_index + 1:], 2)
            restored_function.append(one_residual[residual_index])

    return restored_function

# Пример использования
zero_residual = map(int, input().split("Нулевая остаточная функция"))  # Нулевая остаточная функция для x_i = 0
one_residual = map(int, input().split("Единичная остаточная функция"))    # Единичная остаточная функция для x_i = 1
arg_index = int(input("Номер аргумента"))  # Номер аргумента (начиная с 0)

restored_function = restore_function(zero_residual, one_residual, arg_index)
print("Восстановленная функция:", restored_function)