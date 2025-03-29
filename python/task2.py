def compute_residual(function_vector, arg_value, arg_index):
    """
    Вычисляет остаточную функцию для заданного аргумента и значения.

    :param function_vector: Вектор булевой функции (список 0 и 1).
    :param arg_value: Значение аргумента (0 или 1).
    :param arg_index: Номер аргумента (начиная с 0).
    :return: Вектор остаточной функции.
    """
    n = len(function_vector).bit_length() - 1  # Определяем количество аргументов
    residual_function = []

    for i, value in enumerate(function_vector):
        # Преобразуем индекс в двоичное представление
        binary = bin(i)[2:].zfill(n)
        # Проверяем, совпадает ли значение аргумента с заданным
        if int(binary[arg_index]) == arg_value:
            residual_function.append(value)

    return residual_function

# Пример использования
function_vector = map(int, input().split("Вектор булевой функции "))  # Ввод функции для n=?
arg_value = int(input("Значение аргумента "))  # Фиксируем значение аргумента
arg_index = int(input("Носмер аргумента "))  # Номер аргумента (начиная с 0)

residual = compute_residual(function_vector, arg_value, arg_index)
print("Остаточная функция:", residual)