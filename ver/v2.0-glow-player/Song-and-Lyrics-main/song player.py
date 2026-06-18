import time
import sys
import os
GREEN = '\033[38;5;46m' 
BOLD = '\033[1m'
RESET = '\033[0m'
def typing_effect(text, speed=0.1):
    for char in text:
        sys.stdout.write(f"{BOLD}{GREEN}{char}{RESET}")
        sys.stdout.flush()
        time.sleep(speed)
def run_performance():
    os.system('cls' if os.name == 'nt' else 'clear')
    print("\n\n")
    lyrics = [
        ("Haye Sajan Meri", 0.1),
        ("Akkhan Taras Di", 0.12),
        ("Haye Imaan Mera", 0.1),
        ("Tutt Pai Gaya", 0.15),
        ("Mennu Lutt Le Gaya", 0.18)
    ]
    for line, speed in lyrics:
        sys.stdout.write("    ") 
        typing_effect(line, speed)
        print("\n") 
        time.sleep(1.2) 
    print("\n")
if __name__ == "__main__":
    run_performance()