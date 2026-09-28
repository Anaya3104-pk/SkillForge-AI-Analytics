import subprocess

scripts = [
    "generate_subscription_plans.py",
    "generate_categories.py",
    "generate_instructors.py"
]

for script in scripts:
    print(f"\nRunning {script}...")
    subprocess.run(["python", script], check=True)

print("\nAll master data generated successfully!")