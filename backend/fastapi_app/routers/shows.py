from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
from models import Show, Movie, Theater, Screen, User
from schemas import ShowCreate, ShowResponse
from routers.users import admin_only

router = APIRouter(prefix="/shows", tags=["Shows"])


@router.post("/", response_model=ShowResponse)
def create_show(
    show: ShowCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    movie = db.query(Movie).filter(Movie.id == show.movie_id).first()
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found"
        )

    theater = db.query(Theater).filter(Theater.id == show.theater_id).first()
    if not theater:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Theater not found"
        )

    screen = db.query(Screen).filter(Screen.id == show.screen_id).first()
    if not screen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Screen not found"
        )

    if screen.theater_id != theater.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected screen does not belong to the selected theater"
        )

    if movie.city.lower() != theater.city.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Movie city and theater city do not match"
        )

    existing_show = db.query(Show).filter(
        Show.screen_id == show.screen_id,
        Show.show_date == show.show_date,
        Show.show_time == show.show_time
    ).first()

    if existing_show:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A show already exists for this screen at the same date and time"
        )

    new_show = Show(
        movie_id=show.movie_id,
        theater_id=show.theater_id,
        screen_id=show.screen_id,
        show_date=show.show_date,
        show_time=show.show_time,
        price=show.price
    )

    db.add(new_show)
    db.commit()
    db.refresh(new_show)

    return new_show


@router.get("/", response_model=list[ShowResponse])
def get_shows(
    movie_id: Optional[int] = Query(None),
    city: Optional[str] = Query(None),
    theater_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Show)

    if movie_id:
        query = query.filter(Show.movie_id == movie_id)

    if theater_id:
        query = query.filter(Show.theater_id == theater_id)

    if city:
        query = query.join(Theater, Show.theater_id == Theater.id).filter(Theater.city.ilike(f"%{city}%"))

    shows = query.order_by(Show.id.desc()).all()
    return shows


@router.get("/{show_id}", response_model=ShowResponse)
def get_single_show(show_id: int, db: Session = Depends(get_db)):
    show = db.query(Show).filter(Show.id == show_id).first()

    if not show:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Show not found"
        )

    return show


@router.get("/movie/{movie_id}", response_model=list[ShowResponse])
def get_shows_by_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()

    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found"
        )

    shows = db.query(Show).filter(Show.movie_id == movie_id).order_by(Show.id.desc()).all()
    return shows


@router.get("/city/{city_name}", response_model=list[ShowResponse])
def get_shows_by_city(city_name: str, db: Session = Depends(get_db)):
    shows = (
        db.query(Show)
        .join(Theater, Show.theater_id == Theater.id)
        .filter(Theater.city.ilike(f"%{city_name}%"))
        .order_by(Show.id.desc())
        .all()
    )
    return shows