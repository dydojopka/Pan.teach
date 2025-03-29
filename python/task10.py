import random

def generate_random_function(n):
    """
    Генерирует случайный вектор булевой функции от n переменных.
    :param n: Количество переменных.
    :return: Список из 0 и 1, представляющий вектор функции.
    """
    return [random.randint(0, 1) for _ in range(2 ** n)]

def check_T0(function_vector):
    """
    Проверяет, принадлежит ли функция классу T₀.
    :param function_vector: Вектор булевой функции.
    :return: True, если принадлежит, иначе False.
    """
    return function_vector[0] == 0

def check_T1(function_vector):
    """
    Проверяет, принадлежит ли функция классу T₁.
    :param function_vector: Вектор булевой функции.
    :return: True, если принадлежит, иначе False.
    """
    return function_vector[-1] == 1

def check_S(function_vector):
    """
    Проверяет, принадлежит ли функция классу S (самодвойственная).
    :param function_vector: Вектор булевой функции.
    :return: True, если принадлежит, иначе False.
    """
    n = len(function_vector)
    for i in range(n):
        if function_vector[i] == function_vector[n - 1 - i]:
            return False
    return True

def check_M(function_vector):
    """
    Проверяет, принадлежит ли функция классу M (монотонная).
    :param function_vector: Вектор булевой функции.
    :return: True, если принадлежит, иначе False.
    """
    n = len(function_vector).bit_length() - 1
    for i in range(len(function_vector)):
        for j in range(len(function_vector)):
            if i != j and (i & j) == i and function_vector[i] > function_vector[j]:
                return False
    return True

def check_L(function_vector):
    """
    Проверяет, принадлежит ли функция классу L (линейная).
    :param function_vector: Вектор булевой функции.
    :return: True, если принадлежит, иначе False.
    """
    n = len(function_vector).bit_length() - 1  # Количество переменных
    from sympy import symbols, Poly
    from sympy.logic.boolalg import Xor

    # Создаем символы для переменных
    variables = symbols(f'x1:{n + 1}')

def main():
    print("Добро пожаловать в игру по определению предполных классов булевых функций!")
    n = int(input("Введите количество переменных (n): "))
    function_vector = generate_random_function(n)
    print(f"Вектор функции: {function_vector}")

    print("\nВыберите предполные классы, которым принадлежит функция:")
    print("1. T₀ (сохраняет 0)")
    print("2. T₁ (сохраняет 1)")
    print("3. S (самодвойственная)")
    print("4. M (монотонная)")
    print("5. L (линейная)")
    user_choices = input("Введите номера классов через пробел: ").split()

    # Проверка выбора пользователя
    correct_classes = []
    if check_T0(function_vector):
        correct_classes.append("T₀")
    if check_T1(function_vector):
        correct_classes.append("T₁")
    if check_S(function_vector):
        correct_classes.append("S")
    if check_M(function_vector):
        correct_classes.append("M")
    if check_L(function_vector):
        correct_classes.append("L")

    user_classes = []
    for choice in user_choices:
        if choice == '1':
            user_classes.append("T₀")
        elif choice == '2':
            user_classes.append("T₁")
        elif choice == '3':
            user_classes.append("S")
        elif choice == '4':
            user_classes.append("M")
        elif choice == '5':
            user_classes.append("L")

    print("\nПравильные классы:", correct_classes)
    print("Ваш выбор:", user_classes)

    if set(user_classes) == set(correct_classes):
        print("Поздравляем! Вы правильно выбрали классы.")
    else:
        print("К сожалению, ваш выбор неверен.")

if __name__ == "__main__":
    main()
