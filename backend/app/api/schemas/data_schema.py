from pydantic import BaseModel
from typing import List, Dict, Any

class DataResponse(BaseModel):
    rows: int
    columns: List[str]
    data: List[Dict[str, Any]]

