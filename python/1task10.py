from collections import deque

def tree_to_prufer(tree, n):

    degree = [0] * n
    is_leaf = [False] * n
    prufer_code = []
    
    # Инициализация степеней вершин
    for i in range(n):
        degree[i] = len(tree[i])
        if degree[i] == 1:
            is_leaf[i] = True
    
    leafs = deque()
    # Находим все листья
    for i in range(n):
        if is_leaf[i]:
            leafs.append(i)
    
    for _ in range(n - 2):
        # Берем лист с минимальным номером
        leaf = min(leafs)
        leafs.remove(leaf)
        
        # Находим его соседа
        neighbor = -1
        for v in tree[leaf]:
            if not is_leaf[v] or (is_leaf[v] and v > leaf):
                neighbor = v
                break
        
        prufer_code.append(neighbor)
        
        # Уменьшаем степень соседа
        degree[neighbor] -= 1
        if degree[neighbor] == 1:
            is_leaf[neighbor] = True
            leafs.append(neighbor)
    
    return prufer_code

def prufer_to_tree(code, n):

    degree = [1] * n
    tree = [[] for _ in range(n)]
    
    # Вычисляем степени вершин
    for v in code:
        degree[v] += 1
    
    # Находим листья
    leaves = deque()
    for v in range(n):
        if degree[v] == 1:
            leaves.append(v)
    
    # Строим дерево
    for v in code:
        leaf = min(leaves)
        leaves.remove(leaf)
        
        tree[leaf].append(v)
        tree[v].append(leaf)
        
        degree[v] -= 1
        if degree[v] == 1:
            leaves.append(v)
    
    # Добавляем последнее ребро
    u = leaves[0]
    v = leaves[1]
    tree[u].append(v)
    tree[v].append(u)
    
    return tree

def input_tree(n):

    tree = [[] for _ in range(n)]
    print(f"Введите {n-1} ребер дерева (каждое ребро на новой строке):")
    for _ in range(n-1):
        u, v = map(int, input().split())
        tree[u].append(v)
        tree[v].append(u)
    return tree

def main():
    print("Алгоритм кодирования Прюфера")
    n = int(input("Введите количество вершин в дереве: "))
    
    # Ввод дерева
    tree = input_tree(n)
    
    # Кодирование
    prufer_code = tree_to_prufer(tree, n)
    print("\nКод Прюфера:", prufer_code)
    
    # Декодирование (для проверки)
    decoded_tree = prufer_to_tree(prufer_code, n)
    print("\nДекодированное дерево (список смежности):")
    for i in range(n):
        print(f"{i}: {sorted(decoded_tree[i])}")

if __name__ == "__main__":
    main()