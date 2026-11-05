export interface PythonAcademyLesson {
  id: string;
  title: string;
  task: string;
  theory?: string;
  startingCode: string;
  validation?: string;
  expectOutput?: string;
  mustUse?: string[];
  needsPlot?: boolean;
}

export interface PythonAcademyTopic {
  title: string;
  lessons: PythonAcademyLesson[];
}

export interface PythonAcademyPhase {
  phase: string;
  title: string;
  mainTopics: PythonAcademyTopic[];
}

export interface CheatSheetSnippet {
  label: string;
  explanation: string;
  code: string;
}

export interface CheatSheetSection {
  id: string;
  title: string;
  category: string;
  summary: string;
  snippets: CheatSheetSnippet[];
}

export const PYTHON_ACADEMY_CURRICULUM: PythonAcademyPhase[] = [
  {
    phase: "Phase 1",
    title: "Python Fundamentals",
    mainTopics: [
      {
        title: "1. Environment Setup",
        lessons: [
          {
            id: "p1-1-1",
            mustUse: ["print("],
            title: "Install Python & VS Code",
            theory: "Variables store values, and `print()` displays output in the console. Let's verify our Python 3 environment is ready.",
            task: "Run your first script to confirm Python is in your PATH.",
            startingCode: "import sys\nprint('Python Version:', sys.version)\nprint('Environment Ready!')"
          }
        ]
      },
      {
        title: "2. Variables & Strings",
        lessons: [
          {
            id: "p1-2-1",
            mustUse: ["#", "print("],
            title: "Print & Comments",
            theory: "A string is a series of characters surrounded by single or double quotes. Lines starting with `#` are comments ignored by Python.",
            task: "Use a # to write a comment and print a message.",
            startingCode: "# This is a secret note\nprint('Hello world!')"
          },
          {
            id: "p1-2-2",
            title: "Variables",
            theory: "Variables are used to store values (`msg = \"Hello world!\"`). You can print or update a variable at any time.",
            task: "Create a variable named 'year' and set it to 2025.",
            startingCode: "year = ",
            validation: "globals().get('year') == 2025"
          },
          {
            id: "p1-2-6",
            mustUse: ["+", "print("],
            expectOutput: "albert einstein",
            title: "String Concatenation",
            theory: "You can combine (concatenate) strings using `+`: `full_name = first_name + ' ' + last_name`.",
            task: "Combine first_name = 'albert' and last_name = 'einstein' with a space into full_name, then print full_name.",
            startingCode: "first_name = 'albert'\nlast_name = 'einstein'\nfull_name = first_name + ' ' + last_name\nprint(full_name)",
            validation: "globals().get('full_name') == 'albert einstein'"
          },
          {
            id: "p1-2-3",
            mustUse: ["input(", "print("],
            title: "Input/Output (I/O)",
            theory: "Your programs can prompt the user for input with `input()`. All input is stored as a string.",
            task: "Use input() to ask for a color and print it.",
            startingCode: "color = input('Favorite color? ')\nprint('You chose: ' + color)"
          },
          {
            id: "p1-2-7",
            mustUse: ["input(", "int("],
            title: "Numerical Input (int & float)",
            theory: "Because `input()` returns a string, use `int()` for whole numbers or `float()` for decimals before doing math.",
            task: "Prompt for age using input(), convert it to an integer with int(), and print age.",
            startingCode: "age = input('How old are you? ')\nage = int(age)\nprint(age)",
            validation: "isinstance(globals().get('age'), int)"
          },
          {
            id: "p1-2-4",
            mustUse: ["*"],
            title: "Arithmetic",
            theory: "Python supports `+`, `-`, `*` (multiply), `/` (divide), and `**` (exponents like `x**2`).",
            task: "Calculate 5 times 5 and name the variable 'result'.",
            startingCode: "result = ",
            validation: "globals().get('result') == 25"
          },
          {
            id: "p1-2-5",
            expectOutput: "True",
            mustUse: [">"],
            title: "Comparison Operators",
            theory: "Conditional tests compare values: `==` (equals), `!=` (not equal), `>`, `>=`, `<`, `<=`.",
            task: "Check if 10 is greater than 5 using >.",
            startingCode: "print(10 > 5)"
          }
        ]
      },
      {
        title: "3. Data Types",
        lessons: [
          {
            id: "p1-3-1",
            title: "Numbers (Int & Float)",
            theory: "Integers (`int`) are whole numbers; floats (`float`) have a decimal point.",
            task: "Create an integer named my_int and a decimal (float) named my_float.",
            startingCode: "my_int = 10\nmy_float = 10.5\nprint(type(my_float))",
            validation: "type(globals().get('my_int')) is int and isinstance(globals().get('my_float'), float)"
          },
          {
            id: "p1-3-2",
            title: "Strings & Case Methods",
            theory: "Strings have helpful methods like `.title()`, `.upper()`, and `.lower()`.",
            task: "Create a string named msg using double quotes and print it.",
            startingCode: "msg = \"Python is fun\"\nprint(msg)",
            validation: "isinstance(globals().get('msg'), str)",
            mustUse: ['"', "print("]
          },
          {
            id: "p1-3-3",
            title: "Booleans",
            theory: "A boolean value is either `True` or `False` and tracks conditions inside a program (`game_active = True`).",
            task: "Set a variable named is_sunny to True and print it.",
            startingCode: "is_sunny = True\nprint(is_sunny)",
            validation: "globals().get('is_sunny') is True"
          }
        ]
      }
    ]
  },
  {
    phase: "Phase 2",
    title: "Decision Making & Loops",
    mainTopics: [
      {
        title: "1. If/Else Conditions",
        lessons: [
          {
            id: "p2-1-1",
            expectOutput: "Positive",
            mustUse: ["if"],
            title: "If Statements",
            theory: "`if` statements test a condition and respond when it is `True`.",
            task: "Check if 'num' is positive and print 'Positive'.",
            startingCode: "num = 10\nif num > 0:\n    print('Positive')"
          },
          {
            id: "p2-1-2",
            expectOutput: "Even",
            mustUse: ["if", "else"],
            title: "If-Else Blocks",
            theory: "An `if-else` block runs one block when the test passes and the `else` block otherwise.",
            task: "Create a variable 'x' equal to 4. If x is even, print 'Even', else print 'Odd'.",
            startingCode: "x = 4\nif x % 2 == 0:\n    print('Even')\nelse:\n    print('Odd')",
            validation: "globals().get('x') == 4"
          },
          {
            id: "p2-1-3",
            expectOutput: "B",
            mustUse: ["elif"],
            title: "Elif Ladder",
            theory: "Use `if-elif-else` chains to test more than two possible conditions (e.g., ticket pricing or grading).",
            task: "Set 'score' to 85. If score >= 90 print 'A', elif score >= 80 print 'B', else print 'C'.",
            startingCode: "score = 85\nif score >= 90:\n    print('A')\nelif score >= 80:\n    print('B')\nelse:\n    print('C')",
            validation: "globals().get('score') == 85"
          },
          {
            id: "p2-1-4",
            expectOutput: "You can play!",
            mustUse: ["not in"],
            title: "Testing Membership (in / not in)",
            theory: "Use `in` and `not in` to check whether an item is inside a list (`if user not in banned_users:`).",
            task: "Given banned_users = ['ann', 'chad', 'dee'] and user = 'erin', print 'You can play!' if user is not in banned_users.",
            startingCode: "banned_users = ['ann', 'chad', 'dee']\nuser = 'erin'\nif user not in banned_users:\n    print('You can play!')"
          }
        ]
      },
      {
        title: "2. While & For Loops",
        lessons: [
          {
            id: "p2-2-1",
            expectOutput: "1\n2\n3",
            mustUse: ["while"],
            title: "While Loops",
            theory: "A `while` loop repeats a block of code as long as a certain condition remains `True`.",
            task: "Print numbers from 1 to 3 using a while loop.",
            startingCode: "count = 1\nwhile count <= 3:\n    print(count)\n    count += 1",
            validation: "globals().get('count') == 4"
          },
          {
            id: "p2-2-2",
            expectOutput: "0\n1\n2",
            mustUse: ["for", "range("],
            title: "For Loops",
            theory: "A `for` loop pulls each item from a sequence or `range()` one at a time.",
            task: "Print numbers 0, 1, 2 using range().",
            startingCode: "for i in range(3):\n    print(i)"
          },
          {
            id: "p2-2-3",
            expectOutput: "0\n1\n2",
            mustUse: ["break"],
            title: "Break & Continue",
            theory: "`break` exits a loop immediately; `continue` skips the rest of the current iteration and moves to the next.",
            task: "Loop through range(5). If the number is 3, break. Otherwise print it.",
            startingCode: "for i in range(5):\n    if i == 3:\n        break\n    print(i)"
          },
          {
            id: "p2-2-4",
            mustUse: ["while", "remove("],
            title: "Removing All Instances in a Loop",
            theory: "`list.remove()` only removes the first matching value. Use `while 'cat' in pets:` to remove every occurrence.",
            task: "Remove all occurrences of 'cat' from pets = ['dog', 'cat', 'dog', 'fish', 'cat'] using a while loop.",
            startingCode: "pets = ['dog', 'cat', 'dog', 'fish', 'cat']\nwhile 'cat' in pets:\n    pets.remove('cat')\nprint(pets)",
            validation: "'pets' in globals() and 'cat' not in globals()['pets'] and len(globals()['pets']) == 3"
          }
        ]
      }
    ]
  },
  {
    phase: "Phase 3",
    title: "Data Structures (Lists, Tuples & Dicts)",
    mainTopics: [
      {
        title: "1. Lists & Comprehensions",
        lessons: [
          {
            id: "p3-1-1",
            title: "List Basics & Indexing",
            theory: "A list stores items in order (`bikes = ['trek', 'redline', 'giant']`). Index `0` is the first item; `-1` is the last item.",
            task: "Create a list named 'fruits' with 'apple' and 'banana'.",
            startingCode: "fruits = ['apple', 'banana']\nprint(fruits[0], fruits[-1])",
            validation: "'fruits' in globals() and isinstance(globals()['fruits'], list) and 'apple' in globals()['fruits'] and 'banana' in globals()['fruits']"
          },
          {
            id: "p3-1-2",
            title: "Adding & Inserting Elements",
            theory: "Use `.append(item)` to add to the end of a list, or `.insert(index, item)` to insert at a specific position.",
            task: "Create an empty list 'colors' and append 'red'.",
            startingCode: "colors = []\ncolors.append('red')\nprint(colors)",
            validation: "'colors' in globals() and globals()['colors'] == ['red']"
          },
          {
            id: "p3-1-3",
            mustUse: ["pop("],
            title: "Popping & Removing Elements",
            theory: "`del users[-1]` deletes by index, `.remove('mia')` deletes by value, and `.pop()` removes and returns an item.",
            task: "Pop the last item from users = ['val', 'bob', 'mia'] into most_recent_user and print it.",
            startingCode: "users = ['val', 'bob', 'mia']\nmost_recent_user = users.pop()\nprint(most_recent_user)",
            validation: "globals().get('most_recent_user') == 'mia' and globals().get('users') == ['val', 'bob']"
          },
          {
            id: "p3-1-4",
            mustUse: ["sort"],
            title: "Sorting & Length (sort, sorted, len)",
            theory: "`users.sort()` changes the list order permanently; `sorted(users)` returns a sorted copy; `len(users)` counts items.",
            task: "Sort users = ['val', 'bob', 'mia'] alphabetically in-place using .sort() and store len(users) in num_users.",
            startingCode: "users = ['val', 'bob', 'mia']\nusers.sort()\nnum_users = len(users)\nprint(users, num_users)",
            validation: "globals().get('users') == ['bob', 'mia', 'val'] and globals().get('num_users') == 3"
          },
          {
            id: "p3-1-5",
            mustUse: [":"],
            title: "Slicing & Copying Lists",
            theory: "A slice grabs part of a list: `finishers[:3]` (first 3), `finishers[1:4]` (middle 3), `finishers[-3:]` (last 3), `finishers[:]` (full copy).",
            task: "Slice the first two items from finishers = ['sam', 'bob', 'ada', 'bea'] into first_two.",
            startingCode: "finishers = ['sam', 'bob', 'ada', 'bea']\nfirst_two = finishers[:2]\nprint(first_two)",
            validation: "globals().get('first_two') == ['sam', 'bob']"
          },
          {
            id: "p3-1-6",
            mustUse: ["min(", "max(", "sum("],
            title: "Simple Statistics (min, max, sum)",
            theory: "On numerical lists, `min(ages)` finds the smallest, `max(ages)` the largest, and `sum(ages)` the total.",
            task: "Given ages = [93, 99, 66, 17, 85, 1, 35, 82, 2, 77], compute youngest = min(ages), oldest = max(ages), total_years = sum(ages).",
            startingCode: "ages = [93, 99, 66, 17, 85, 1, 35, 82, 2, 77]\nyoungest = min(ages)\noldest = max(ages)\ntotal_years = sum(ages)\nprint(youngest, oldest, total_years)",
            validation: "globals().get('youngest') == 1 and globals().get('oldest') == 99 and globals().get('total_years') == 557"
          },
          {
            id: "p3-1-7",
            mustUse: ["for", "**"],
            title: "List Comprehensions",
            theory: "A list comprehension generates a list in one line: `squares = [x**2 for x in range(1, 11)]`.",
            task: "Use a list comprehension to generate squares of numbers 1 through 10 in a list named 'squares'.",
            startingCode: "squares = [x**2 for x in range(1, 11)]\nprint(squares)",
            validation: "globals().get('squares') == [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]"
          }
        ]
      },
      {
        title: "2. Tuples & Sets",
        lessons: [
          {
            id: "p3-2-1",
            title: "Tuples",
            theory: "A tuple is like a list, except its items cannot be modified (`dimensions = (800, 600)`). You can overwrite the whole tuple variable.",
            task: "Create a tuple named 'coords' with values 10 and 20.",
            startingCode: "coords = (10, 20)\nprint(coords)",
            validation: "'coords' in globals() and isinstance(globals()['coords'], tuple) and globals()['coords'] == (10, 20)"
          },
          {
            id: "p3-2-2",
            title: "Sets",
            theory: "Sets store unique items and automatically remove duplicates (`{1, 2, 2}` becomes `{1, 2}`).",
            task: "Create a set named 'unique_nums' with values 1, 2, and 2 (note duplicate removal).",
            startingCode: "unique_nums = {1, 2, 2}\nprint(unique_nums)",
            validation: "'unique_nums' in globals() and isinstance(globals()['unique_nums'], set) and globals()['unique_nums'] == {1, 2}"
          }
        ]
      },
      {
        title: "3. Dictionaries & Nesting",
        lessons: [
          {
            id: "p3-3-1",
            title: "Dictionaries",
            theory: "Dictionaries store key-value pairs (`alien_0 = {'color': 'green', 'points': 5}`).",
            task: "Create a dict 'grades' mapping 'Alice' to 95.",
            startingCode: "grades = {'Alice': 95}\nprint(grades)",
            validation: "'grades' in globals() and isinstance(globals()['grades'], dict) and globals()['grades'].get('Alice') == 95"
          },
          {
            id: "p3-3-2",
            mustUse: [".get("],
            title: "Safe Lookups with .get()",
            theory: "`alien_0.get('points', 0)` returns the value for `'points'` if it exists, or `0` instead of raising a `KeyError`.",
            task: "Use .get('points', 0) on alien_0 = {'color': 'green'} and store the result in alien_points.",
            startingCode: "alien_0 = {'color': 'green'}\nalien_points = alien_0.get('points', 0)\nprint(alien_points)",
            validation: "globals().get('alien_points') == 0"
          },
          {
            id: "p3-3-3",
            mustUse: [".items()"],
            title: "Looping Through Dictionaries",
            theory: "Use `.items()` for key-value pairs, `.keys()` for keys, and `.values()` for values.",
            task: "Loop through fav_numbers = {'eric': 17, 'ever': 4} using .items() and print each name and number.",
            startingCode: "fav_numbers = {'eric': 17, 'ever': 4}\nfor name, number in fav_numbers.items():\n    print(name + ' loves ' + str(number))"
          },
          {
            id: "p3-3-4",
            title: "Nesting: Lists & Dictionaries",
            theory: "You can store dictionaries inside a list (`users = [{'first': 'marie', 'last': 'curie'}]`), lists inside a dictionary, or dictionaries inside a dictionary.",
            task: "Create a list named 'users' containing two user dictionaries, each with a 'username' key.",
            startingCode: "users = [\n    {'username': 'efermi', 'first': 'enrico'},\n    {'username': 'mcurie', 'first': 'marie'},\n]\nfor u in users:\n    print(u['username'])",
            validation: "isinstance(globals().get('users'), list) and len(globals()['users']) >= 2 and all(isinstance(x, dict) and 'username' in x for x in globals()['users'])"
          }
        ]
      }
    ]
  },
  {
    phase: "Phase 4",
    title: "Functions & Modules",
    mainTopics: [
      {
        title: "1. Functions",
        lessons: [
          {
            id: "p4-1-1",
            title: "Defining Functions",
            theory: "Functions are named blocks of code defined with `def` that perform a specific job.",
            task: "Define a function 'greet(name)' that returns 'Hello ' + name.",
            startingCode: "def greet(name):\n    return 'Hello ' + name\n\nprint(greet('Sam'))",
            validation: "'greet' in globals() and callable(globals()['greet']) and globals()['greet']('Sam') == 'Hello Sam'"
          },
          {
            id: "p4-1-2",
            title: "Return Values",
            theory: "A function can compute and `return` a value or dictionary to the caller.",
            task: "Define a function 'square(x)' that returns x times x.",
            startingCode: "def square(x):\n    return x * x\n\nprint(square(4))",
            validation: "'square' in globals() and callable(globals()['square']) and globals()['square'](4) == 16"
          },
          {
            id: "p4-1-3",
            title: "Default & Keyword Arguments",
            theory: "Give parameters default values (`def make_pizza(topping='bacon'):`) and call functions with keyword arguments (`describe_pet(animal='dog', name='willie')`).",
            task: "Define make_pizza(topping='bacon') that returns 'Have a ' + topping + ' pizza!'.",
            startingCode: "def make_pizza(topping='bacon'):\n    return 'Have a ' + topping + ' pizza!'\n\nprint(make_pizza())\nprint(make_pizza('pepperoni'))",
            validation: "'make_pizza' in globals() and globals()['make_pizza']() == 'Have a bacon pizza!' and globals()['make_pizza']('pepperoni') == 'Have a pepperoni pizza!'"
          },
          {
            id: "p4-1-4",
            mustUse: ["*toppings", "**user_info"],
            title: "Arbitrary Arguments (*args & **kwargs)",
            theory: "`*toppings` collects any number of positional arguments into a tuple; `**user_info` collects keyword arguments into a dictionary.",
            task: "Define make_order(size, *toppings) and build_profile(first, last, **user_info) and call both.",
            startingCode: "def make_order(size, *toppings):\n    return (size, list(toppings))\n\ndef build_profile(first, last, **user_info):\n    profile = {'first': first, 'last': last}\n    profile.update(user_info)\n    return profile\n\nprint(make_order('large', 'mushrooms', 'peppers'))\nprint(build_profile('marie', 'curie', field='chemistry'))",
            validation: "'build_profile' in globals() and globals()['build_profile']('a', 'b', city='kumasi').get('city') == 'kumasi'"
          }
        ]
      },
      {
        title: "2. Modules",
        lessons: [
          {
            id: "p4-2-1",
            title: "Math Module",
            theory: "Python's standard library includes `math` for mathematical functions like `math.sqrt()`.",
            task: "Import the 'math' module and calculate square root of 64 as 'ans'.",
            startingCode: "import math\nans = math.sqrt(64)\nprint(ans)",
            validation: "'ans' in globals() and globals()['ans'] == 8.0"
          },
          {
            id: "p4-2-2",
            title: "Random Module",
            theory: "The `random` module generates random numbers and selections (`random.randint(1, 100)`).",
            task: "Import 'random' and use randint(1, 100) to get a number 'num'.",
            startingCode: "import random\nnum = random.randint(1, 100)\nprint(num)",
            validation: "'num' in globals() and isinstance(globals()['num'], int) and 1 <= globals()['num'] <= 100"
          },
          {
            id: "p4-2-3",
            mustUse: ["from pizza import make_pizza"],
            title: "Importing Custom Modules & Aliases",
            theory: "Store functions in a separate module (`pizza.py`) and import them with `import pizza` or `from pizza import make_pizza as mp`.",
            task: "Import make_pizza from our preloaded pizza module and call it for a 'medium' pizza with 'pepperoni'.",
            startingCode: "from pizza import make_pizza as mp\nmp('medium', 'pepperoni')\nmp('small', 'bacon', 'pineapple')"
          }
        ]
      }
    ]
  },
  {
    phase: "Phase 5",
    title: "Object-Oriented Python",
    mainTopics: [
      {
        title: "1. Classes & Objects",
        lessons: [
          {
            id: "p5-1-1",
            title: "Defining Classes",
            theory: "A class defines the attributes and behavior of a category of objects (`class Dog:` or `class Robot:`). `__init__` initializes new instances.",
            task: "Define a class 'Robot' with attribute 'name'. Set 'r = Robot(\"Dexter\")'.",
            startingCode: "class Robot:\n    def __init__(self, name):\n        self.name = name\n\nr = Robot('Dexter')\nprint(r.name)",
            validation: "'r' in globals() and 'Robot' in globals() and isinstance(globals()['r'], globals()['Robot']) and globals()['r'].name == 'Dexter'"
          },
          {
            id: "p5-1-2",
            title: "Methods",
            theory: "Functions inside a class are called methods and receive `self` as their first parameter.",
            task: "Add a method 'greet(self)' to 'Robot' returning 'I am ' + self.name. Call it on 'r'.",
            startingCode: "class Robot:\n    def __init__(self, name):\n        self.name = name\n    def greet(self):\n        return 'I am ' + self.name\n\nr = Robot('Dexter')\nmsg = r.greet()\nprint(msg)",
            validation: "'msg' in globals() and globals()['msg'] == 'I am Dexter'"
          },
          {
            id: "p5-1-3",
            title: "Inheritance (super)",
            theory: "A child class inherits attributes and methods from its parent class (`super().__init__(...)`) and can add or override methods.",
            task: "Create class 'MedicalRobot' that inherits from 'Robot' and has a method 'heal()'.",
            startingCode: "class Robot:\n    def __init__(self, name):\n        self.name = name\n\nclass MedicalRobot(Robot):\n    def heal(self):\n        return 'Healed!'\n\nmr = MedicalRobot('Helper')\nprint(mr.name, mr.heal())",
            validation: "'mr' in globals() and 'MedicalRobot' in globals() and isinstance(globals()['mr'], globals()['MedicalRobot']) and globals()['mr'].heal() == 'Healed!' and globals()['mr'].name == 'Helper'"
          },
          {
            id: "p5-1-4",
            mustUse: ["from car import Car, ElectricCar"],
            title: "Instances as Attributes (Car & Battery)",
            theory: "Classes can hold instances of other classes as attributes—like `ElectricCar` having `self.battery = Battery()`—and can be imported from `car.py`.",
            task: "Import Car and ElectricCar from car, create my_ecar = ElectricCar('tesla', 'model x', 2016), charge it, and store its battery range in ecar_range.",
            startingCode: "from car import Car, ElectricCar\n\nmy_ecar = ElectricCar('tesla', 'model x', 2016)\nmy_ecar.charge()\necar_range = my_ecar.battery.get_range()\nprint('Range:', ecar_range)",
            validation: "globals().get('ecar_range') == 240"
          }
        ]
      }
    ]
  },
  {
    phase: "Phase 6",
    title: "Data Visualization & Libraries",
    mainTopics: [
      {
        title: "1. NumPy Arrays",
        lessons: [
          {
            id: "p6-1-1",
            title: "NumPy Basics",
            theory: "NumPy provides fast numerical arrays and mathematical operations across sequences.",
            task: "Import numpy as np. Create a 1D array 'arr' with values [10, 20, 30].",
            startingCode: "import numpy as np\narr = np.array([10, 20, 30])\nprint(arr)",
            validation: "import numpy as np; 'arr' in globals() and isinstance(globals()['arr'], np.ndarray) and list(globals()['arr']) == [10, 20, 30]"
          }
        ]
      },
      {
        title: "2. Matplotlib & Pygal Plots",
        lessons: [
          {
            id: "p6-2-1",
            needsPlot: true,
            mustUse: ["plt.plot"],
            title: "Line Plots",
            theory: "`plt.plot(x_values, squares)` draws a line graph. In Python Academy, your plot renders automatically in the Matplotlib Graph tab!",
            task: "Import matplotlib.pyplot as plt and numpy as np. Plot y = sin(x) for x from 0 to 10.",
            startingCode: "import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 10, 100)\ny = np.sin(x)\nplt.plot(x, y)\nplt.title('Sine Wave')\nplt.show()"
          },
          {
            id: "p6-2-2",
            needsPlot: true,
            mustUse: ["plt.bar"],
            title: "Bar Charts",
            theory: "`plt.bar(labels, values)` compares quantities across categories.",
            task: "Create a bar chart showing category values. labels = ['Apples', 'Bananas'], values = [12, 18].",
            startingCode: "import matplotlib.pyplot as plt\nlabels = ['Apples', 'Bananas']\nvalues = [12, 18]\nplt.bar(labels, values)\nplt.title('Fruit Count')\nplt.show()"
          },
          {
            id: "p6-2-3",
            needsPlot: true,
            mustUse: ["plt.scatter", "plt.fill_between"],
            title: "Scatter Plots & Filling Space",
            theory: "Use `plt.scatter()` to plot individual points and `plt.fill_between(x, y1, y2, alpha=0.25)` to shade the region between two series.",
            task: "Plot x_values = list(range(11)), squares, and cubes with plt.scatter() and shade between them using plt.fill_between().",
            startingCode: "import matplotlib.pyplot as plt\n\nx_values = list(range(11))\nsquares = [x**2 for x in x_values]\ncubes = [x**3 for x in x_values]\n\nplt.scatter(x_values, squares, c='blue', s=20)\nplt.scatter(x_values, cubes, c='red', s=20)\nplt.fill_between(x_values, cubes, squares, facecolor='blue', alpha=0.25)\nplt.title('Squares vs Cubes')\nplt.show()"
          },
          {
            id: "p6-2-4",
            needsPlot: true,
            mustUse: ["import pygal", "render_to_file"],
            title: "Interactive Charts with Pygal",
            theory: "Pygal builds charts with `pygal.Line()`, `pygal.Bar()`, and `pygal.XY()`, then exports them with `chart.render_to_file('rolling_dice.svg')`.",
            task: "Use pygal.Bar() to plot dice outcomes = [1, 2, 3, 4, 5, 6] and frequencies = [18, 16, 18, 17, 18, 13] and render_to_file('rolling_dice.svg').",
            startingCode: "import pygal\n\noutcomes = [1, 2, 3, 4, 5, 6]\nfrequencies = [18, 16, 18, 17, 18, 13]\n\nchart = pygal.Bar()\nchart.title = 'Rolling a D6'\nchart.x_labels = outcomes\nchart.add('D6', frequencies)\nchart.render_to_file('rolling_dice.svg')"
          }
        ]
      }
    ]
  },
  {
    phase: "Phase 7",
    title: "Files, Exceptions & JSON",
    mainTopics: [
      {
        title: "1. Reading & Writing Files",
        lessons: [
          {
            id: "p7-1-1",
            mustUse: ["with open(", "siddhartha.txt"],
            title: "Reading a File (read & readlines)",
            theory: "`with open(filename) as f_obj:` opens a file and closes it automatically when finished. We have pre-loaded `siddhartha.txt` and `alice.txt` in your workspace!",
            task: "Open 'siddhartha.txt', store its lines in a list named 'lines' using .readlines(), and print each line.",
            startingCode: "filename = 'siddhartha.txt'\nwith open(filename) as f_obj:\n    lines = f_obj.readlines()\n\nfor line in lines:\n    print(line.rstrip())",
            validation: "isinstance(globals().get('lines'), list) and len(globals()['lines']) >= 3"
          },
          {
            id: "p7-1-2",
            mustUse: ["open(", "'w'", "'a'"],
            title: "Writing & Appending to Files",
            theory: "Pass `'w'` to `open(filename, 'w')` to write a new file, and `'a'` to append new lines without erasing existing text.",
            task: "Write 'I love programming!\\n' to 'programming.txt' in 'w' mode, then append 'I love making games.\\n' in 'a' mode and read it back into 'contents'.",
            startingCode: "filename = 'programming.txt'\nwith open(filename, 'w') as f:\n    f.write('I love programming!\\n')\n\nwith open(filename, 'a') as f:\n    f.write('I love making games.\\n')\n\nwith open(filename) as f:\n    contents = f.read()\nprint(contents)",
            validation: "'I love programming!' in str(globals().get('contents', '')) and 'I love making games.' in str(globals().get('contents', ''))"
          }
        ]
      },
      {
        title: "2. Exceptions & JSON Storage",
        lessons: [
          {
            id: "p7-2-1",
            mustUse: ["try:", "except ZeroDivisionError:"],
            expectOutput: "You can't divide by zero!",
            title: "Handling Exceptions (try / except)",
            theory: "Place code that might raise an error inside a `try:` block and handle the error gracefully in `except ZeroDivisionError:` or `except FileNotFoundError:`.",
            task: "Use a try-except block to catch ZeroDivisionError when dividing 5/0 and print \"You can't divide by zero!\".",
            startingCode: "try:\n    print(5 / 0)\nexcept ZeroDivisionError:\n    print(\"You can't divide by zero!\")"
          },
          {
            id: "p7-2-2",
            mustUse: ["json.dump(", "json.load("],
            title: "Storing Data with JSON",
            theory: "The `json` module lets you save Python lists and dictionaries to a file with `json.dump(data, f_obj)` and reload them with `json.load(f_obj)`.",
            task: "Save primes = [2, 3, 5, 7, 11, 13] to 'primes.json' using json.dump(), then load it back into 'loaded_primes' with json.load().",
            startingCode: "import json\n\nprimes = [2, 3, 5, 7, 11, 13]\nwith open('primes.json', 'w') as f_obj:\n    json.dump(primes, f_obj)\n\nwith open('primes.json') as f_obj:\n    loaded_primes = json.load(f_obj)\n\nprint(loaded_primes)",
            validation: "globals().get('loaded_primes') == [2, 3, 5, 7, 11, 13]"
          }
        ]
      }
    ]
  },
  {
    phase: "Phase 8",
    title: "Testing Your Code & Game/Web Frameworks",
    mainTopics: [
      {
        title: "1. Unit Testing (unittest)",
        lessons: [
          {
            id: "p8-1-1",
            mustUse: ["unittest.TestCase", "assertEqual"],
            title: "Testing a Function",
            theory: "Inherit from `unittest.TestCase` and write methods starting with `test_`. Use `self.assertEqual(actual, expected)` to verify behavior.",
            task: "Write a TestCase for get_full_name from full_names that verifies both 'janis joplin' and 'david lee roth'.",
            startingCode: "import unittest\nfrom full_names import get_full_name\n\nclass NamesTestCase(unittest.TestCase):\n    def test_first_last(self):\n        full_name = get_full_name('janis', 'joplin')\n        self.assertEqual(full_name, 'Janis Joplin')\n\n    def test_middle(self):\n        full_name = get_full_name('david', 'roth', 'lee')\n        self.assertEqual(full_name, 'David Lee Roth')\n\nres = unittest.main()",
            validation: "globals().get('res') is not None and globals()['res'].wasSuccessful()"
          },
          {
            id: "p8-1-2",
            mustUse: ["def setUp(self):", "Accountant"],
            title: "Testing a Class with setUp()",
            theory: "When testing a class (`Accountant`), `setUp(self)` runs before every test method so `self.acc` starts fresh.",
            task: "Use setUp() to create self.acc = Accountant() and test both deposit(100) and withdraw(100).",
            startingCode: "import unittest\nfrom accountant import Accountant\n\nclass TestAccountant(unittest.TestCase):\n    def setUp(self):\n        self.acc = Accountant()\n\n    def test_deposit(self):\n        self.acc.deposit(100)\n        self.assertEqual(self.acc.balance, 100)\n\n    def test_withdrawal(self):\n        self.acc.deposit(1000)\n        self.acc.withdraw(100)\n        self.assertEqual(self.acc.balance, 900)\n\nres = unittest.main()",
            validation: "globals().get('res') is not None and globals()['res'].wasSuccessful()"
          }
        ]
      },
      {
        title: "2. Pygame 2D Logic & Django Models",
        lessons: [
          {
            id: "p8-2-1",
            mustUse: ["pg.Rect(", "spritecollideany"],
            title: "Pygame Rectangles & Collisions",
            theory: "In Pygame, `pg.Rect(left, top, width, height)` positions game objects and `pg.sprite.spritecollideany(ship, aliens)` detects collisions.",
            task: "Create a screen, position a ship rect at screen_rect.midbottom, and check a bullet rect.",
            startingCode: "import pygame as pg\n\npg.init()\nscreen = pg.display.set_mode((1200, 800))\nscreen_rect = screen.get_rect()\n\nship = pg.image.load('images/ship.bmp')\nship_rect = ship.get_rect()\nship_rect.midbottom = screen_rect.midbottom\n\nbullet_rect = pg.Rect(600, 760, 3, 15)\nhit = ship_rect.colliderect(bullet_rect)\nprint('Ship center:', ship_rect.center, 'Collision:', hit)",
            validation: "globals().get('hit') is True"
          },
          {
            id: "p8-2-2",
            mustUse: ["models.Model", "models.CharField"],
            title: "Django Models & Views",
            theory: "In Django, models inherit from `models.Model` (`Topic`, `Entry`) and views use `render(request, template, context)` to return data.",
            task: "Define a Django Topic model with text = models.CharField(max_length=200), create a 'Chess' topic, and query Topic.objects.all().",
            startingCode: "from django.db import models\nfrom django.shortcuts import render\n\nclass Topic(models.Model):\n    text = models.CharField(max_length=200)\n    def __str__(self):\n        return self.text\n\nt = Topic.objects.create(text='Chess')\nall_topics = Topic.objects.all()\nprint(all_topics)",
            validation: "'all_topics' in globals() and len(globals()['all_topics']) >= 1 and str(globals()['all_topics'][0]) == 'Chess'"
          }
        ]
      }
    ]
  }
];

export const PYTHON_CHEAT_SHEETS: CheatSheetSection[] = [
  {
    id: "variables-strings",
    title: "Variables, Strings & User Input",
    category: "Core Basics (Pages 1, 8)",
    summary: "Store values in variables, combine strings with +, and prompt users with input().",
    snippets: [
      {
        label: "Variables & Concatenation",
        explanation: "Combine strings using + and format names with .title().",
        code: "first_name = 'albert'\nlast_name = 'einstein'\nfull_name = first_name + ' ' + last_name\nprint(full_name.title())"
      },
      {
        label: "Prompting for Input (String & Numerical)",
        explanation: "input() always returns a string. Wrap it in int() or float() for math.",
        code: "name = input(\"What's your name? \")\nage = int(input(\"How old are you? \"))\nprint(\"Hello, \" + name + \"! Next year you'll be \" + str(age + 1) + \".\")"
      }
    ]
  },
  {
    id: "lists-tuples",
    title: "Lists, Slicing, Comprehensions & Tuples",
    category: "Data Structures (Pages 1, 3–4)",
    summary: "Store ordered sequences, slice ranges, compute min/max/sum, and build list comprehensions.",
    snippets: [
      {
        label: "Modifying, Sorting & Popping Lists",
        explanation: "Append, insert, remove by value, pop by index, and sort lists.",
        code: "users = ['val', 'bob', 'mia', 'ron', 'ned']\nusers.append('amy')\nusers.insert(0, 'joe')\nmost_recent = users.pop()\nprint('Sorted copy:', sorted(users))\nprint('Total users:', len(users))"
      },
      {
        label: "Slicing, Copying & List Comprehensions",
        explanation: "Slice portions with [start:stop], copy with [:], and generate lists in one line.",
        code: "finishers = ['kai', 'abe', 'ada', 'gus', 'zoe']\nfirst_three = finishers[:3]\ncopy_of_finishers = finishers[:]\nsquares = [x**2 for x in range(1, 11)]\nages = [93, 99, 66, 17, 85, 1, 35, 82, 2, 77]\nprint('First 3:', first_three)\nprint('Squares:', squares)\nprint('Min/Max/Sum:', min(ages), max(ages), sum(ages))"
      },
      {
        label: "Tuples (Immutable Sequences)",
        explanation: "Tuples use parentheses and cannot be modified item-by-item, though the variable can be overwritten.",
        code: "dimensions = (800, 600)\nfor d in dimensions:\n    print(d)\ndimensions = (1200, 900)\nprint('Updated tuple:', dimensions)"
      }
    ]
  },
  {
    id: "dictionaries-nesting",
    title: "Dictionaries & Nesting",
    category: "Data Structures (Pages 1, 5–6)",
    summary: "Connect keys and values, use .get() safely, loop through items, and nest dictionaries and lists.",
    snippets: [
      {
        label: "Accessing, Modifying & Safe .get()",
        explanation: "Use .get(key, default) to avoid KeyError when a key might not exist.",
        code: "alien_0 = {'color': 'green', 'points': 5}\nalien_0['x'] = 0\nalien_0['y'] = 25\nspeed = alien_0.get('speed', 'slow')\nfor k, v in alien_0.items():\n    print(str(k) + ': ' + str(v))"
      },
      {
        label: "Nesting Dictionaries & Lists",
        explanation: "Store lists inside dictionaries or dictionaries inside a dictionary.",
        code: "users = {\n    'aeinstein': {'first': 'albert', 'last': 'einstein', 'location': 'princeton'},\n    'mcurie': {'first': 'marie', 'last': 'curie', 'location': 'paris'},\n}\nfor username, info in users.items():\n    full = info['first'] + ' ' + info['last']\n    print(username + ' -> ' + full.title() + ' (' + info['location'].title() + ')')"
      }
    ]
  },
  {
    id: "if-while",
    title: "If Statements & While Loops",
    category: "Control Flow (Pages 1–2, 7–8)",
    summary: "Test conditions with if-elif-else, boolean operators (and/or/in), and control while loops with flags, break, and continue.",
    snippets: [
      {
        label: "If-Elif-Else & List Membership",
        explanation: "Combine comparison operators and check if items are in/not in a list.",
        code: "age = 12\nif age < 4:\n    price = 0\nelif age < 18:\n    price = 5\nelse:\n    price = 10\nprint('Ticket cost: $' + str(price))\n\nplayers = ['al', 'bea', 'cyn', 'dale']\nprint('Is al playing?', 'al' in players)"
      },
      {
        label: "While Loops & Removing All Matches",
        explanation: "Repeat while a condition holds true; remove every instance of an item from a list.",
        code: "pets = ['dog', 'cat', 'dog', 'fish', 'cat', 'rabbit', 'cat']\nwhile 'cat' in pets:\n    pets.remove('cat')\nprint('Without cats:', pets)"
      }
    ]
  },
  {
    id: "functions-modules",
    title: "Functions & Modules",
    category: "Modularity (Pages 2, 9–10)",
    summary: "Write reusable functions with default/optional parameters, *args, **kwargs, list copies, and module imports.",
    snippets: [
      {
        label: "Positional, Keyword & Default Arguments",
        explanation: "Define default parameter values and return dictionaries.",
        code: "def build_person(first, last, age=None):\n    person = {'first': first, 'last': last}\n    if age:\n        person['age'] = age\n    return person\n\nprint(build_person('jimi', 'hendrix', 27))"
      },
      {
        label: "Arbitrary Args (*toppings & **user_info) & Module Import",
        explanation: "Accept any number of arguments or import from pizza.py.",
        code: "from pizza import make_pizza as mp\nmp('large', 'pepperoni', 'mushrooms', 'extra cheese')"
      }
    ]
  },
  {
    id: "classes-oop",
    title: "Classes & Object-Oriented Programming",
    category: "OOP (Pages 2, 11–12)",
    summary: "Model real-world objects with classes, attributes, methods, inheritance (super), and composition.",
    snippets: [
      {
        label: "Dog & SARDog Inheritance",
        explanation: "Child classes inherit parent attributes and methods via super().__init__().",
        code: "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def sit(self):\n        print(self.name + ' is sitting.')\n\nclass SARDog(Dog):\n    def search(self):\n        print(self.name + ' is searching.')\n\nmy_dog = SARDog('Willie')\nmy_dog.sit()\nmy_dog.search()"
      },
      {
        label: "Car, Battery & ElectricCar Fleet",
        explanation: "Use an instance (Battery) as an attribute of ElectricCar and build a fleet.",
        code: "from car import Car, ElectricCar\nmy_ecar = ElectricCar('tesla', 'model x', 2016)\nmy_ecar.charge()\nprint('Battery range:', my_ecar.battery.get_range())\nmy_ecar.drive()"
      }
    ]
  },
  {
    id: "files-exceptions-json",
    title: "Files, Exceptions & JSON",
    category: "Persistence & Error Handling (Pages 2, 13–14)",
    summary: "Read and write files with 'with open()', catch exceptions with try-except-else, and store data with json.",
    snippets: [
      {
        label: "Reading & Writing Files + FileNotFoundError",
        explanation: "Read pre-loaded books and silently skip missing files.",
        code: "f_names = ['alice.txt', 'siddhartha.txt', 'missing.txt', 'moby_dick.txt']\nfor f_name in f_names:\n    try:\n        with open(f_name) as f_obj:\n            lines = f_obj.readlines()\n    except FileNotFoundError:\n        pass\n    else:\n        print(f\"{f_name} has {len(lines)} lines.\")"
      },
      {
        label: "Storing & Loading JSON Data",
        explanation: "Use json.dump() and json.load() to persist Python data structures.",
        code: "import json\nnumbers = [2, 3, 5, 7, 11, 13]\nwith open('numbers.json', 'w') as f:\n    json.dump(numbers, f)\nwith open('numbers.json') as f:\n    loaded = json.load(f)\nprint('Loaded from JSON:', loaded)"
      }
    ]
  },
  {
    id: "testing-unittest",
    title: "Testing Your Code (unittest)",
    category: "Quality Assurance (Pages 15–16)",
    summary: "Write automated unit tests for functions and classes using unittest.TestCase, assertEqual, and setUp().",
    snippets: [
      {
        label: "Testing Functions & Classes with unittest",
        explanation: "Run unittest.main() right inside the browser editor.",
        code: "import unittest\nfrom full_names import get_full_name\nfrom accountant import Accountant\n\nclass PortfolioTests(unittest.TestCase):\n    def setUp(self):\n        self.acc = Accountant(100)\n    def test_name(self):\n        self.assertEqual(get_full_name('janis', 'joplin'), 'Janis Joplin')\n    def test_deposit(self):\n        self.acc.deposit(50)\n        self.assertEqual(self.acc.balance, 150)\n\nunittest.main()"
      }
    ]
  },
  {
    id: "viz-matplotlib-pygal",
    title: "Data Visualization (Matplotlib, Datetime & Pygal)",
    category: "Charts & Graphs (Pages 19–22)",
    summary: "Plot line graphs, scatter plots, colormaps, subplots, date-axis charts, and Pygal bar/line charts.",
    snippets: [
      {
        label: "Matplotlib Subplots & Colormaps",
        explanation: "Create side-by-side subplots of squares and cubes.",
        code: "import matplotlib.pyplot as plt\nx_vals = list(range(11))\nsquares = [x**2 for x in x_vals]\ncubes = [x**3 for x in x_vals]\nfig, axarr = plt.subplots(1, 2, figsize=(8, 3.5))\naxarr[0].scatter(x_vals, squares, c='blue')\naxarr[0].set_title('Squares')\naxarr[1].scatter(x_vals, cubes, c='red')\naxarr[1].set_title('Cubes')\nplt.show()"
      },
      {
        label: "Datetime Formatting & High Temperatures",
        explanation: "Parse and format dates with datetime.strptime() and strftime().",
        code: "from datetime import datetime as dt\nimport matplotlib.pyplot as plt\ndates = [dt(2016, 6, 21), dt(2016, 6, 22), dt(2016, 6, 23), dt(2016, 6, 24)]\nhighs = [57, 68, 64, 59]\nplt.figure(figsize=(7, 3.5))\nplt.plot(dates, highs, c='red', marker='o')\nplt.title('Daily High Temps')\nplt.show()"
      }
    ]
  },
  {
    id: "pygame-django",
    title: "Pygame 2D Games & Django Web Apps",
    category: "Frameworks (Pages 17–18, 23–26)",
    summary: "Work with Pygame Rect coordinates, Sprite groups, and collisions, or build Django models, views, and URLs.",
    snippets: [
      {
        label: "Pygame Sprite Groups & Group Collisions",
        explanation: "Create Sprite objects, add them to Groups, and detect collisions.",
        code: "import pygame as pg\nfrom pygame.sprite import Sprite, Group\n\nclass Bullet(Sprite):\n    def __init__(self, x, y):\n        super().__init__()\n        self.rect = pg.Rect(x, y, 4, 12)\n\nclass Alien(Sprite):\n    def __init__(self, x, y):\n        super().__init__()\n        self.rect = pg.Rect(x, y, 40, 40)\n\nbullets = Group()\naliens = Group()\nbullets.add(Bullet(110, 110))\naliens.add(Alien(100, 100))\ncollisions = pg.sprite.groupcollide(bullets, aliens, True, True)\nprint('Collisions detected:', len(collisions))"
      },
      {
        label: "Django Models, ForeignKey & Views",
        explanation: "Define Topic and Entry models and query them in a view function.",
        code: "from django.db import models\nfrom django.shortcuts import render\n\nclass Topic(models.Model):\n    text = models.CharField(max_length=200)\n    def __str__(self):\n        return self.text\n\nclass Entry(models.Model):\n    topic = models.ForeignKey(Topic)\n    text = models.TextField()\n    def __str__(self):\n        return self.text[:50] + '...'\n\nt = Topic.objects.create(text='Rock Climbing')\nEntry.objects.create(topic=t, text='Learned essential knots and belaying techniques today.')\nprint('Topics:', Topic.objects.all())\nprint('Entries:', Entry.objects.all())"
      }
    ]
  }
];

