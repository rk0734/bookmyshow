import { Search, Menu, MapPin, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">B</span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-foreground">
              Book<span className="text-primary">My</span>Show
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="nav-link font-medium">
              Movies
            </a>
            <a href="#" className="nav-link font-medium">
              Events
            </a>
            <a href="#" className="nav-link font-medium">
              Plays
            </a>
            <a href="#" className="nav-link font-medium">
              Sports
            </a>
          </nav>

          {/* Search & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search movies, events..."
                className="search-input w-64"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Mumbai
            </Button>

            {loading ? (
              <Button variant="ghost" disabled>
                Loading...
              </Button>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.email || "U")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.user_metadata?.full_name || "User"}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/bookings")}>
                    <User className="mr-2 h-4 w-4" />
                    My Bookings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search movies, events..."
                className="search-input w-full"
              />
            </div>
            <nav className="flex flex-col gap-3">
              <a href="#" className="text-foreground font-medium py-2">
                Movies
              </a>
              <a href="#" className="text-foreground font-medium py-2">
                Events
              </a>
              <a href="#" className="text-foreground font-medium py-2">
                Plays
              </a>
              <a href="#" className="text-foreground font-medium py-2">
                Sports
              </a>
              {user && (
                <a
                  href="#"
                  onClick={() => navigate("/bookings")}
                  className="text-foreground font-medium py-2"
                >
                  My Bookings
                </a>
              )}
            </nav>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                Mumbai
              </Button>
              {user ? (
                <Button
                  variant="destructive"
                  onClick={handleSignOut}
                  className="flex-1"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
