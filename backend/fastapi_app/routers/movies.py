from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
from models import Movie, User
from schemas import MovieCreate, MovieUpdate, MovieResponse
from routers.users import admin_only, get_current_user

router = APIRouter(prefix="/movies", tags=["Movies"])


@router.post("/", response_model=MovieResponse)
def create_movie(
    movie: MovieCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    new_movie = Movie(
        title=movie.title,
        description=movie.description,
        language=movie.language,
        duration=movie.duration,
        category=movie.category,
        city=movie.city,
        poster_url=movie.poster_url,
        release_date=movie.release_date,
        rating=movie.rating,
        popularity=movie.popularity or 0
    )

    db.add(new_movie)
    db.commit()
    db.refresh(new_movie)

    return new_movie


@router.get("/", response_model=list[MovieResponse])
def get_movies(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("latest"),
    db: Session = Depends(get_db)
):
    query = db.query(Movie)

    if search:
        query = query.filter(Movie.title.ilike(f"%{search}%"))

    if category:
        query = query.filter(Movie.category.ilike(f"%{category}%"))

    if language:
        query = query.filter(Movie.language.ilike(f"%{language}%"))

    if city:
        query = query.filter(Movie.city.ilike(f"%{city}%"))

    if sort_by == "popularity":
        query = query.order_by(Movie.popularity.desc())
    else:
        query = query.order_by(Movie.id.desc())

    movies = query.all()
    return movies


@router.get("/{movie_id}", response_model=MovieResponse)
def get_single_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()

    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found"
        )

    return movie


@router.put("/{movie_id}", response_model=MovieResponse)
def update_movie(
    movie_id: int,
    movie_data: MovieUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()

    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found"
        )

    update_fields = movie_data.model_dump(exclude_unset=True)

    for key, value in update_fields.items():
        setattr(movie, key, value)

    db.commit()
    db.refresh(movie)

    return movie


@router.delete("/{movie_id}")
def delete_movie(
    movie_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()

    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found"
        )

    db.delete(movie)
    db.commit()

    return {"message": "Movie deleted successfully"}


@router.get("/admin/all", response_model=list[MovieResponse])
def get_all_movies_for_admin(
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    movies = db.query(Movie).order_by(Movie.id.desc()).all()
    return movies