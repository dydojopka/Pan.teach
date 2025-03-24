import random

def generate_random_function(num_vars):
    """Генерирует случайный вектор функции для заданного количества переменных"""
    length = 2 ** num_vars
    return [random.randint(0, 1) for _ in range(length)]

def vector_to_dnf(function_vector, num_vars):
    """Преобразует вектор функции в совершенную ДНФ (СДНФ)"""
    dnf = []
    for i, value in enumerate(function_vector):
        if value == 1:
            conj = []
            for j in range(num_vars):
                var_val = (i >> (num_vars - 1 - j)) & 1
                conj.append((j, not var_val))
            dnf.append(conj)
    return dnf

def dnf_to_string(dnf, num_vars):
    """Преобразует ДНФ в строку для вывода"""
    if not dnf:
        return "0"  # Константа 0
    
    conj_strs = []
    for conj in dnf:
        lit_strs = []
        for var, neg in conj:
            if neg:
                lit_strs.append(f"!x{var+1}")
            else:
                lit_strs.append(f"x{var+1}")
        conj_strs.append("*".join(lit_strs))
    
    return " + ".join(conj_strs) if conj_strs else "1"  # Константа 1

def evaluate_dnf(dnf, num_vars):
    """Вычисляет значения ДНФ для всех возможных входных комбинаций"""
    inputs = []
    for i in range(2 ** num_vars):
        inputs.append([(i >> j) & 1 for j in range(num_vars)])
    
    results = []
    for inp in inputs:
        result = False
        for conj in dnf:
            conj_val = True
            for var, neg in conj:
                var_val = inp[var]
                if neg:
                    var_val = not var_val
                conj_val = conj_val and var_val
                if not conj_val:
                    break
            result = result or conj_val
            if result:
                break
        results.append(int(result))
    return results

def parse_dnf(dnf_str, num_vars):
    """Парсит строку ДНФ в список конъюнкций"""
    dnf = []
    conjunctions = dnf_str.split('+')
    for conj in conjunctions:
        conj = conj.strip()
        if not conj:
            continue
        literals = []
        for lit in conj.split('*'):
            lit = lit.strip()
            if not lit:
                continue
            neg = False
            if lit.startswith('!'):
                neg = True
                var = lit[1:]
            else:
                var = lit
            try:
                var_idx = int(var.replace('x', '')) - 1
                if var_idx < 0 or var_idx >= num_vars:
                    raise ValueError(f"Переменная {var} вне диапазона")
                literals.append((var_idx, neg))
            except ValueError:
                raise ValueError(f"Некорректная переменная: {var}")
        dnf.append(literals)
    return dnf

def main():
    print("Игра: Проверка ДНФ")
    print("Введите количество переменных (например, 2 для функции от x1 и x2):")
    
    # Получаем количество переменных от пользователя
    while True:
        try:
            num_vars = int(input())
            if num_vars <= 0:
                print("Ошибка: количество переменных должно быть положительным")
                continue
            break
        except ValueError:
            print("Ошибка: введите целое число")
    
    # Генерируем случайную функцию
    function_vector = generate_random_function(num_vars)
    correct_dnf = vector_to_dnf(function_vector, num_vars)
    
    print(f"\nСгенерирован вектор функции: {''.join(map(str, function_vector))}")
    print(f"Функция имеет {num_vars} переменных (x1, x2, ..., x{num_vars})")
    print("Введите ДНФ для этой функции (например, !x1*x2 + x1*!x2)")
    print("Используйте формат: !x1*x2 + x3 (где ! обозначает отрицание, * - И, + - ИЛИ)")
    
    # Получаем ДНФ от пользователя
    while True:
        dnf_str = input().strip()
        try:
            dnf = parse_dnf(dnf_str, num_vars)
            break
        except ValueError as e:
            print(f"Ошибка: {e}. Попробуйте снова.")
    
    # Вычисляем значения ДНФ для всех комбинаций
    computed_vector = evaluate_dnf(dnf, num_vars)
    
    # Сравниваем с исходным вектором функции
    if computed_vector == function_vector:
        print("\nПравильно! Введённая ДНФ соответствует заданной функции.")
    else:
        print("\nВведённая ДНФ не соответствует заданной функции.")
        print("\nПравильная ДНФ:")
        print(dnf_to_string(correct_dnf, num_vars))

if __name__ == "__main__":
    main()