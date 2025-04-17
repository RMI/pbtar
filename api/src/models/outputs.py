from pydantic import BaseModel


#  create Pydantic model for mtcars dataset
class mtcar(BaseModel):
    model: str
    mpg: float
    cyl: int
    disp: float
    hp: int
    drat: float
    wt: float
    qsec: float
    vs: bool
    am: bool
    gear: int
    carb: int
