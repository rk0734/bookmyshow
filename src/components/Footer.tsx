import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Press</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Help</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">FAQs</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms of Use</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Sitemap</a></li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Movies</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Events</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Plays</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Sports</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">B</span>
            </div>
            <span className="font-semibold text-foreground">
              Book<span className="text-primary">My</span>Show
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © 2024 BookMyShow Clone. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
