def build_sknf(function_vector):
    """
    Строит СКНФ по вектору булевой функции.

    :param function_vector: Вектор булевой функции (список 0 и 1).
    :return: Строка, представляющая СКНФ.
    """
    n = len(function_vector).bit_length() - 1  # Определяем количество переменных
    sknf_terms = []  # Список для хранения дизъюнкций

    for i, value in enumerate(function_vector):
        if value == 0:
            # Преобразуем индекс в двоичное представление
            binary = bin(i)[2:].zfill(n)
            term = []
            for j in range(n):
                if binary[j] == '0':
                    term.append(f"x{j + 1}")  # Без изменений
                else:
                    term.append(f"¬x{j + 1}")  # Отрицание
            sknf_terms.append(" ∨ ".join(term))  # Добавляем дизъюнкцию

    # Объединяем все дизъюнкции через конъюнкцию
    sknf = " ∧ ".join([f"({term})" for term in sknf_terms])
    return sknf

# Пример использования
function_vector = list(map(int, input("Введите вектор функции через пробел: ").split()))
sknf = build_sknf(function_vector)
print("СКНФ:", sknf)