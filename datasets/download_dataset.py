import os
import urllib.request

def download_dataset():
    url = "https://raw.githubusercontent.com/Ugochukwuodinaka/Maternal-Health-Risk-Analysis/main/Maternal%20Health%20Risk%20Data%20Set.csv"
    dest_dir = os.path.dirname(os.path.abspath(__file__))
    dest_path = os.path.join(dest_dir, "maternal_health_risk.csv")
    
    print(f"Downloading dataset from {url}...")
    try:
        urllib.request.urlretrieve(url, dest_path)
        print(f"Successfully downloaded to {dest_path}")
    except Exception as e:
        print(f"Failed to download dataset: {e}")
        # Write dummy data or raise error
        raise e

if __name__ == "__main__":
    download_dataset()
