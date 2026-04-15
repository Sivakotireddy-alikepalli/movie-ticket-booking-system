from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Theater, Screen, User
from schemas import TheaterCreate, TheaterResponse, ScreenCreate, ScreenResponse
from routers.users import admin_only

router = APIRouter(tags=["Theaters & Screens"])


@router.post("/theaters", response_model=TheaterResponse)
def create_theater(
    theater: TheaterCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    new_theater = Theater(
        name=theater.name,
        city=theater.city,
        location=theater.location
    )

    db.add(new_theater)
    db.commit()
    db.refresh(new_theater)

    return new_theater


@router.get("/theaters", response_model=list[TheaterResponse])
def get_theaters(db: Session = Depends(get_db)):
    theaters = db.query(Theater).order_by(Theater.id.desc()).all()
    return theaters


@router.get("/theaters/{theater_id}", response_model=TheaterResponse)
def get_single_theater(theater_id: int, db: Session = Depends(get_db)):
    theater = db.query(Theater).filter(Theater.id == theater_id).first()

    if not theater:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Theater not found"
        )

    return theater


@router.post("/screens", response_model=ScreenResponse)
def create_screen(
    screen: ScreenCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    theater = db.query(Theater).filter(Theater.id == screen.theater_id).first()

    if not theater:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Theater not found"
        )

    new_screen = Screen(
        theater_id=screen.theater_id,
        name=screen.name,
        total_seats=screen.total_seats
    )

    db.add(new_screen)
    db.commit()
    db.refresh(new_screen)

    return new_screen


@router.get("/screens", response_model=list[ScreenResponse])
def get_screens(db: Session = Depends(get_db)):
    screens = db.query(Screen).order_by(Screen.id.desc()).all()
    return screens


@router.get("/theaters/{theater_id}/screens", response_model=list[ScreenResponse])
def get_screens_by_theater(theater_id: int, db: Session = Depends(get_db)):
    theater = db.query(Theater).filter(Theater.id == theater_id).first()

    if not theater:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Theater not found"
        )

    screens = db.query(Screen).filter(Screen.theater_id == theater_id).order_by(Screen.id.desc()).all()
    return screens