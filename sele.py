from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pyotp
import sys
import time
import os
import json

def count_files_in_directory(directory):
    return len([f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))])

def delete_all_files_recursively(directory):
    for root, dirs, files in os.walk(directory, topdown=False):
        for file in files:
            file_path = os.path.join(root, file)
            os.remove(file_path)
            print(f"Deleted: {file_path}")

count=0
mail = input("Enter your mail: ")
fact = input("Enter your 2fact sec: ")
service = Service('/usr/local/bin/geckodriver')
driver = webdriver.Firefox(service=service)
driver.get('https://developer.samsung.com/remote-test-lab')
try:
    wait = WebDriverWait(driver, 10)
    sign_in = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, 'util-group-sign-in')))
    sign_in.click()
    wait = WebDriverWait(driver, 10)
    time.sleep(14)
    email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="iptLgnPlnID"]')))
    email_input.click()
    email_input.send_keys(mail)
    sign_in_button =  driver.find_element(By.XPATH, '//*[@id="signInButton"]')
    sign_in_button.click()
    wait = WebDriverWait(driver, 10)
    time.sleep(14)
    email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="iptLgnPlnPD"]')))
    email_input.click()
    email_input.send_keys('Lexa@heda12')
    sign_in_button =  driver.find_element(By.XPATH, '//*[@id="signInButton"]')
    sign_in_button.click()
    wait = WebDriverWait(driver, 15)
    time.sleep(14)
    email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="iptAuthNum"]')))
    totp = pyotp.TOTP(fact.replace(" ",""))
    email_input.click()
    email_input.send_keys(totp.now())
    sign_in_button =  driver.find_element(By.XPATH, '//*[@id="btnNext"]')
    sign_in_button.click()
    wait = WebDriverWait(driver, 10)
    time.sleep(2)
    started = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="desktop-btn"]')))
    started.click()
    cookies = driver.get_cookies()
    if(len(sys.argv) > 1):
        if(sys.argv[1]=="0"):
            delete_all_files_recursively("./cookies")
            count=1
        else:
            count = sys.argv[1]
    else:
        count=count_files_in_directory("./cookies") +1
    for cookie in cookies:
        print(cookie)
    with open(f'./cookies/cookies{count}.txt', 'w') as f:
        for cookie in cookies:
            f.write(f"{cookie['name']}={cookie['value']}\n")
    print("Finished...")

finally:
    # driver.quit()
    pass