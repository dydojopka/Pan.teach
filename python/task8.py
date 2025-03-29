def input_function_vector():
    """
    Запрашивает вектор булевой функции и проверяет его корректность.
    :return: Список из 0 и 1, представляющий вектор функции.
    """
    while True:
        user_input = input("Введите вектор булевой функции (последовательность 0 и 1 без пробелов): ")
        
        # Проверяем, что ввод состоит только из 0 и 1
        if all(char in {'0', '1'} for char in user_input):
            # Преобразуем строку в список чисел
            function_vector = [int(bit) for bit in user_input]
            return function_vector
        else:
            print("Ошибка: ввод должен содержать только 0 и 1. Попробуйте снова.")

def build_sdnf(function_vector):
    """
    Строит СДНФ по вектору булевой функции.
    :param function_vector: Вектор булевой функции (список 0 и 1).
    :return: Строка, представляющая СДНФ.
    """
    n = len(function_vector).bit_length() - 1  # Определяем количество переменных
    sdnf_terms = []  # Список для хранения конъюнкций

    for i, value in enumerate(function_vector):
        if value == 1:
            # Преобразуем индекс в двоичное представление
            binary = bin(i)[2:].zfill(n)
            term = []
            for j in range(n):
                if binary[j] == '0':
                    term.append(f"¬x{j + 1}")  # Отрицание
                else:
                    term.append(f"x{j + 1}")  # Без изменений
            sdnf_terms.append(" ∧ ".join(term))  # Добавляем конъюнкцию

    # Объединяем все конъюнкции через дизъюнкцию
    sdnf = " ∨ ".join([f"({term})" for term in sdnf_terms])
    return sdnf

# Основная программа
if __name__ == "__main__":
    # Ввод вектора функции
    function_vector = input_function_vector()
    
    # Построение СДНФ
    sdnf = build_sdnf(function_vector)
    
    # Вывод результата
    print("СДНФ:", sdnf)

