import { createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Home from '@/pages/Home';
import About from '@/pages/About';
import MovieDetails from '@/pages/MovieDetails';
import NotFound from '@/pages/NotFound';
import Watchlist from '@/pages/Watchlist';

const rootRoute = createRootRoute({
    component: Outlet,
});

const HomeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Home,
});

const AboutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/about',
    component: About,
});

const MovieDetailsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/$movieId',
    component: MovieDetails,
});

const NotFoundRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '*',
    component: NotFound,
});

const WatchlistRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/watchlist',
    component: Watchlist,
});

export {
    rootRoute,
    HomeRoute,
    AboutRoute,
    MovieDetailsRoute,
    NotFoundRoute,
    WatchlistRoute,
};

const routeTree = rootRoute.addChildren([
  HomeRoute,
  AboutRoute,
  MovieDetailsRoute,
  NotFoundRoute,
  WatchlistRoute,
]);

export { routeTree };