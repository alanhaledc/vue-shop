import {date} from 'quasar'

export const createError = (code, msg) => {
  const error = new Error(msg)
  error.code = code
  return error
}

const SITE = 'http://p9bh93etu.bkt.clouddn.com/'

export const dateDiff = time => {
  const unit = 'days'
  const num = date.getDateDiff(Date.now(), time, unit)
  if (num <= 31) {
    return `${num}天`
  } else if (num < 365) {
    return `${Math.floor(num / 31)}个月`
  } else {
    return `${Math.floor(num / 365)}年`
  }
}

export const normalizeMovies = data => {
  let movies = []
  data.forEach(item => {
    const movie = {
      poster: SITE + item.posterKey,
      url: SITE + item.videoKey,
      title: item.title,
      subtitle: item.rawTitle,
      rate: item.rate,
      update: dateDiff(item.meta.createdAt),
      _id: item._id,
      summary: item.summary
    }
    movies.push(movie)
  })
  return movies
}

export const normalizeMovieDetail = data => {
  return {
    pic: SITE + data.coverKey,
    url: SITE + data.videoKey,
    rate: data.rate,
    tags: data.tags.join(' '),
    title: data.title,
    update: dateDiff(data.meta.createdAt),
    summary: data.summary
  }
}

export const normalizeRelativeMovies = data => {
  let movies = []
  data.forEach(item => {
    const movie = {
      _id: item._id,
      poster: SITE + item.posterKey,
      title: item.title,
      pubdate: date.formatDate(item.pubdate[0].date, 'YYYY.MM'),
      country: item.pubdate[0].country
    }
    movies.push(movie)
  })
  // 只要前5部电影
  return movies.slice(0, 5)
}

export const normalizeAdminMovies = data => {
  let movies = []
  data.forEach(item => {
    const movie = {
      poster: SITE + item.posterKey,
      title: item.title,
      rate: item.rate,
      type: item.movieTypes,
      tags: item.tags,
      update: dateDiff(item.meta.createdAt),
      pubdate: date.formatDate(item.pubdate[0].date, 'YYYY.MM'),
      _id: item._id,
      id: item.movieId,
      summary: item.summary,
      detail: '详情'
    }
    movies.push(movie)
  })
  return movies
}
