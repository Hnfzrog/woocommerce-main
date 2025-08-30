import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DashboardService, DashboardServiceType } from 'src/app/dashboard.service';
import { WeddingDataService, WeddingData } from '../../services/wedding-data.service';

// Attendance interface for type safety
interface AttendanceRequest {
  user_id: number;
  nama: string;
  kehadiran: 'hadir' | 'tidak_hadir' | 'mungkin';
  pesan: string;
}

interface AttendanceResponse {
  message: string;
  data?: {
    id: number;
    user_id: number;
    nama: string;
    kehadiran: string;
    pesan: string;
    created_at: string;
  };
  errors?: any;
  error?: string;
}

declare var bootstrap: any;
enum ContentView {
  MAIN = 'main',
  COUPLE = 'couple',
  MESSAGE = 'message',
  CALENDAR = 'calendar',
  BIRTHDAY = 'birthday',
  CHAT = 'chat',
  GALLERY = 'gallery',
  PROFILE = 'profile',
  GIFT = 'gift'
}

@Component({
  selector: 'wc-wedding-view',
  templateUrl: './wedding-view.component.html',
  styleUrls: ['./wedding-view.component.scss']
})
export class WeddingViewComponent implements OnInit, AfterViewInit, OnDestroy {

  ContentView = ContentView;

  isPlaying: boolean = false;
  isMuted: boolean = false;
  sideIconsVisible: boolean = false;
  invitationOpened: boolean = false;

  currentView: ContentView = ContentView.MAIN;

  // Wedding data properties
  weddingData: WeddingData | null = null;
  coupleName: string | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  // Subscriptions
  private subscriptions = new Subscription();

  // LocalStorage keys
  private readonly STORAGE_KEYS = {
    CURRENT_VIEW: 'wedding_current_view',
    INVITATION_OPENED: 'wedding_invitation_opened',
    SIDE_ICONS_VISIBLE: 'wedding_side_icons_visible',
    IS_PLAYING: 'wedding_is_playing',
    IS_MUTED: 'wedding_is_muted',
    WEDDING_DATA: 'wedding_data',
    COUPLE_NAME: 'wedding_couple_name'
  };

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private weddingDataService: WeddingDataService
  ) { }

  ngOnInit() {
    this.injectRippleStyles();
    this.loadStateFromLocalStorage();
    this.initializeWeddingData();
  }

  ngAfterViewInit() {
    this.initializeBootstrapTooltips();
    this.addClickFunctionality();
    this.addTouchSupport();
    this.addSideIconClickFunctionality();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    // Save current state before component destruction
    this.saveStateToLocalStorage();
  }

  /**
   * Load component state from localStorage
   */
  private loadStateFromLocalStorage(): void {
    try {
      // Validate localStorage data first
      if (!this.validateLocalStorageData()) {
        console.log('localStorage data invalid, clearing...');
        this.clearLocalStorage();
        return;
      }

      // Load basic state
      const savedCurrentView = localStorage.getItem(this.STORAGE_KEYS.CURRENT_VIEW) as ContentView;
      const savedInvitationOpened = localStorage.getItem(this.STORAGE_KEYS.INVITATION_OPENED);
      const savedSideIconsVisible = localStorage.getItem(this.STORAGE_KEYS.SIDE_ICONS_VISIBLE);
      const savedIsPlaying = localStorage.getItem(this.STORAGE_KEYS.IS_PLAYING);
      const savedIsMuted = localStorage.getItem(this.STORAGE_KEYS.IS_MUTED);
      const savedCoupleName = localStorage.getItem(this.STORAGE_KEYS.COUPLE_NAME);
      const savedWeddingData = localStorage.getItem(this.STORAGE_KEYS.WEDDING_DATA);

      // Restore state if exists
      if (savedCurrentView && Object.values(ContentView).includes(savedCurrentView)) {
        this.currentView = savedCurrentView;
        console.log('Restored current view from localStorage:', savedCurrentView);
      }

      if (savedInvitationOpened !== null) {
        this.invitationOpened = savedInvitationOpened === 'true';
        console.log('Restored invitation opened state:', this.invitationOpened);
      }

      if (savedSideIconsVisible !== null) {
        this.sideIconsVisible = savedSideIconsVisible === 'true';
      }

      if (savedIsPlaying !== null) {
        this.isPlaying = savedIsPlaying === 'true';
      }

      if (savedIsMuted !== null) {
        this.isMuted = savedIsMuted === 'true';
      }

      if (savedCoupleName) {
        this.coupleName = savedCoupleName;
        console.log('Restored couple name from localStorage:', savedCoupleName);
      }

      // Restore wedding data if exists and is valid
      if (savedWeddingData) {
        try {
          const parsedWeddingData = JSON.parse(savedWeddingData);
          this.weddingData = parsedWeddingData;
          this.weddingDataService.setWeddingData(parsedWeddingData);
          console.log('Restored wedding data from localStorage');
        } catch (parseError) {
          console.error('Failed to parse saved wedding data:', parseError);
          localStorage.removeItem(this.STORAGE_KEYS.WEDDING_DATA);
        }
      }

    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
      this.clearLocalStorage();
    }
  }

  /**
   * Save component state to localStorage
   */
  private saveStateToLocalStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.CURRENT_VIEW, this.currentView);
      localStorage.setItem(this.STORAGE_KEYS.INVITATION_OPENED, this.invitationOpened.toString());
      localStorage.setItem(this.STORAGE_KEYS.SIDE_ICONS_VISIBLE, this.sideIconsVisible.toString());
      localStorage.setItem(this.STORAGE_KEYS.IS_PLAYING, this.isPlaying.toString());
      localStorage.setItem(this.STORAGE_KEYS.IS_MUTED, this.isMuted.toString());

      if (this.coupleName) {
        localStorage.setItem(this.STORAGE_KEYS.COUPLE_NAME, this.coupleName);
      }

      if (this.weddingData) {
        localStorage.setItem(this.STORAGE_KEYS.WEDDING_DATA, JSON.stringify(this.weddingData));
      }

      console.log('State saved to localStorage');
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }

  /**
   * Clear localStorage data (useful for testing or logout)
   */
  private clearLocalStorage(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('localStorage cleared');
  }

  /**
   * Check if wedding data exists in localStorage
   */
  private hasLocalStorageData(): boolean {
    return localStorage.getItem(this.STORAGE_KEYS.WEDDING_DATA) !== null;
  }

  /**
   * Validate localStorage data integrity
   */
  private validateLocalStorageData(): boolean {
    try {
      const savedWeddingData = localStorage.getItem(this.STORAGE_KEYS.WEDDING_DATA);
      const savedCoupleName = localStorage.getItem(this.STORAGE_KEYS.COUPLE_NAME);

      if (!savedWeddingData || !savedCoupleName) {
        return false;
      }

      const parsedData = JSON.parse(savedWeddingData);
      return !!(parsedData && parsedData.user_info && parsedData.mempelai);
    } catch (error) {
      console.error('localStorage validation failed:', error);
      return false;
    }
  }

  /**
   * Debug method to export localStorage data (development only)
   */
  public exportLocalStorageData(): any {
    const data: any = {};
    Object.entries(this.STORAGE_KEYS).forEach(([key, storageKey]) => {
      const value = localStorage.getItem(storageKey);
      data[key] = value;
    });
    console.log('LocalStorage Data Export:', data);
    return data;
  }

  /**
   * Initialize wedding data from route parameters and API
   * Always fetch fresh data from API for real-time updates, but check localStorage first
   */
  private initializeWeddingData(): void {
    // Get route params (only couple name needed)
    const routeSubscription = this.route.params.subscribe(params => {
      const routeCoupleName = params['coupleName'] || null;

      console.log('Route params:', { coupleName: routeCoupleName });

      // Determine couple name: prefer route params, fallback to localStorage
      if (routeCoupleName) {
        this.coupleName = routeCoupleName;
      } else if (!this.coupleName) {
        // No route param and no localStorage couple name
        this.loadWeddingDataFromService();
        return;
      }

      // Check if we have valid wedding data in localStorage for this couple
      if (this.weddingData && this.coupleName === routeCoupleName) {
        console.log('Using wedding data from localStorage');
        this.updateWeddingContent(this.weddingData);
        // Still fetch fresh data in background for updates
        if (this.coupleName) {
          this.loadWeddingDataFromAPI(this.coupleName, true);
        }
      } else {
        // Load fresh data from API
        if (this.coupleName) {
          this.loadWeddingDataFromAPI(this.coupleName);
        }
      }
    });

    this.subscriptions.add(routeSubscription);
  }

  /**
   * Load wedding data from API using couple name
   * @param coupleName - Couple name for API call (e.g., 'anton-keok')
   * @param isBackgroundUpdate - Whether this is a background update (don't show loading)
   */
  private loadWeddingDataFromAPI(coupleName: string, isBackgroundUpdate: boolean = false): void {
    if (!isBackgroundUpdate) {
      this.isLoading = true;
      this.errorMessage = null;
    }

    console.log('Loading fresh wedding data from API for couple:', coupleName, isBackgroundUpdate ? '(background)' : '');

    // Use the endpoint: v1/wedding-profile/couple/anton-keok
    const apiSubscription = this.dashboardService.getParam(DashboardServiceType.WEDDING_VIEW_COUPLE, `/${coupleName}`).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        console.log('API Response (formatted):', JSON.stringify(response, null, 2));

        if (response && response.data) {
          console.log('Wedding Data from API:', JSON.stringify(response.data, null, 2));

          this.weddingData = response.data;
          this.weddingDataService.setWeddingData(response.data);

          this.updateWeddingContent(response.data);

          // Save to localStorage after successful API call
          this.saveStateToLocalStorage();

          console.log('Fresh wedding data loaded successfully from API');
        } else {
          if (!isBackgroundUpdate) {
            this.handleDataNotFound('No data returned from API');
          }
        }
      },
      error: (error) => {
        console.error('API Error:', error);
        console.error('API Error (formatted):', JSON.stringify(error, null, 2));
        if (!isBackgroundUpdate) {
          this.handleAPIError(error);
        }
      },
      complete: () => {
        if (!isBackgroundUpdate) {
          this.isLoading = false;
        }
      }
    });

    this.subscriptions.add(apiSubscription);
  }

  /**
   * Load wedding data from service (fallback)
   */
  private loadWeddingDataFromService(): void {
    const serviceSubscription = this.weddingDataService.getWeddingData().subscribe(data => {
      if (data) {
        this.weddingData = data;
        this.updateWeddingContent(data);
        console.log('Wedding data loaded from service');
      } else {
        this.handleDataNotFound('No data available in service');
      }
    });

    this.subscriptions.add(serviceSubscription);
  }

  /**
   * Handle case when no route parameters are available
   */
  private handleNoParameters(): void {
    console.warn('No route parameters available');
    this.loadWeddingDataFromService(); // Try service as fallback
  }

  /**
   * Handle case when wedding data is not found
   * @param reason - Reason for data not being found
   */
  private handleDataNotFound(reason: string): void {
    this.errorMessage = `Wedding invitation not found. ${reason}`;
    this.isLoading = false;

    console.warn('Wedding data not found:', reason);

    // Clear localStorage if data is not found
    this.clearLocalStorage();

    // Optional: Redirect to home after 5 seconds
    setTimeout(() => {
      if (!this.weddingData) {
        console.log('Redirecting to home due to missing wedding data');
        this.router.navigate(['/']);
      }
    }, 5000);
  }

  /**
   * Handle API errors
   * @param error - Error that occurred during API call
   */
  private handleAPIError(error: any): void {
    this.isLoading = false;

    let errorMsg = 'Unable to load wedding invitation.';

    if (error.status === 401) {
      errorMsg = 'Authentication required to access this wedding invitation.';
    } else if (error.status === 404) {
      errorMsg = 'Wedding invitation not found.';
    } else if (error.status === 500) {
      errorMsg = 'Server error occurred. Please try again later.';
    }

    this.errorMessage = errorMsg;
    console.error('API Error details:', error);
  }

  /**
   * Update wedding content based on received data
   * @param data - Wedding data from API
   */
  private updateWeddingContent(data: WeddingData): void {
    try {
      console.log('Updating wedding content with fresh data:', JSON.stringify(data, null, 2));
      console.log('Updating wedding content for:', {
        groom: data.mempelai?.pria?.nama_lengkap || 'Unknown',
        bride: data.mempelai?.wanita?.nama_lengkap || 'Unknown',
        user: data.user_info?.email || 'Unknown'
      });

      // Here you would update component properties based on wedding data
      // Example implementation for when you add UI binding:
      // this.groomName = data.mempelai.pria.nama_lengkap;
      // this.brideName = data.mempelai.wanita.nama_lengkap;
      // this.coverPhoto = data.mempelai.cover_photo;
      // this.weddingDate = data.acara?.tanggal;
      // etc.

    } catch (error) {
      console.error('Error updating wedding content:', error);
      this.errorMessage = 'Error displaying wedding content';
    }
  }

  /**
   * Retry loading wedding data - always fetch fresh from API
   */
  retryLoadData(): void {
    this.errorMessage = null;

    if (this.coupleName) {
      this.loadWeddingDataFromAPI(this.coupleName);
    } else {
      this.loadWeddingDataFromService();
    }
  }

  /**
   * Refresh wedding data - fetch fresh data from API
   */
  refreshWeddingData(): void {
    if (this.coupleName) {
      console.log('Refreshing wedding data for couple:', this.coupleName);
      this.loadWeddingDataFromAPI(this.coupleName);
    }
  }

  /**
   * Check if wedding data is available
   * @returns boolean - Whether wedding data is loaded
   */
  hasWeddingData(): boolean {
    return this.weddingData !== null;
  }

  /**
   * Get couple display name for UI
   * @returns string - Formatted couple name for display
   */
  getCoupleDisplayName(): string {
    if (!this.weddingData?.mempelai) {
      return this.coupleName?.replace('-', ' & ') || 'Wedding Invitation';
    }

    const groom = this.weddingData.mempelai.pria?.nama_panggilan ||
      this.weddingData.mempelai.pria?.nama_lengkap || 'Groom';
    const bride = this.weddingData.mempelai.wanita?.nama_panggilan ||
      this.weddingData.mempelai.wanita?.nama_lengkap || 'Bride';

    return `${groom} & ${bride}`;
  }

  /**
   * Get cover photo URL
   * @returns string - Cover photo URL or default
   */
  getCoverPhotoUrl(): string {
    return this.weddingData?.mempelai?.cover_photo || 'assets/default-cover.jpg';
  }

  /**
   * Get groom photo URL
   * @returns string - Groom photo URL or default
   */
  getGroomPhotoUrl(): string {
    return this.weddingData?.mempelai?.pria?.photo || 'assets/default-groom.jpg';
  }

  /**
   * Get bride photo URL
   * @returns string - Bride photo URL or default
   */
  getBridePhotoUrl(): string {
    return this.weddingData?.mempelai?.wanita?.photo || 'assets/default-bride.jpg';
  }

  togglePlay(): void {
    this.isPlaying = !this.isPlaying;
    this.saveStateToLocalStorage();
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.saveStateToLocalStorage();
  }

  toggleSideIcons(): void {
    this.sideIconsVisible = !this.sideIconsVisible;
    this.saveStateToLocalStorage();
  }

  openInvitation(): void {
    this.invitationOpened = true;
    this.setCurrentView(ContentView.COUPLE);

    // Track invitation view via attendance API
    this.submitAttendanceView();

    // Save state immediately after opening invitation
    this.saveStateToLocalStorage();
  }

  /**
   * Submit attendance record for view tracking
   * Note: This uses the RSVP attendance API with default values for view tracking purposes
   */
  private submitAttendanceView(): void {
    if (!this.weddingData?.user_info?.id) {
      console.warn('Cannot track attendance: user_info.id not available');
      return;
    }

    const attendanceData: AttendanceRequest = {
      user_id: this.weddingData.user_info.id,
      nama: 'View Tracker', // Default name for view tracking
      kehadiran: 'hadir', // Default status for view tracking
      pesan: 'Undangan telah dilihat' // Default message for view tracking
    };

    console.log('Tracking invitation view with attendance data:', attendanceData);

    const attendanceSubscription = this.dashboardService.create(
      DashboardServiceType.ATTENDANCE,
      attendanceData
    ).subscribe({
      next: (response: AttendanceResponse) => {
        console.log('Attendance view tracked successfully:', response);
        if (response.data) {
          console.log('View tracking record created with ID:', response.data.id);
        }
      },
      error: (error) => {
        console.error('Failed to track attendance view:', error);

        // Log specific error details without blocking the user experience
        if (error.status === 422) {
          console.error('Validation error for attendance tracking:', error.error?.errors);
        } else if (error.status === 500) {
          console.error('Server error during attendance tracking:', error.error?.error);
        }

        // Don't show error to user since this is background tracking
        // The invitation should still open normally
      },
      complete: () => {
        console.log('Attendance view tracking request completed');
      }
    });

    this.subscriptions.add(attendanceSubscription);
  }

  setCurrentView(view: ContentView): void {
    this.currentView = view;
    this.saveStateToLocalStorage();
  }

  showMessages(): void {
    this.setCurrentView(ContentView.MESSAGE);
  }

  toggleFavorite(event: MouseEvent): void {
    this.currentView = this.currentView === ContentView.COUPLE ? ContentView.MAIN : ContentView.COUPLE;
  }

  showCalendar(): void {
    this.setCurrentView(ContentView.CALENDAR);
  }

  showBirthday(): void {
    this.setCurrentView(ContentView.BIRTHDAY);
  }

  showChat(): void {
    this.setCurrentView(ContentView.CHAT);
  }

  showGallery(): void {
    this.setCurrentView(ContentView.GALLERY);
  }

  showProfile(): void {
    this.setCurrentView(ContentView.PROFILE);
  }

  showGifts(): void {
    this.setCurrentView(ContentView.GIFT);
  }

  isCurrentView(view: ContentView): boolean {
    return this.currentView === view;
  }

  private initializeBootstrapTooltips(): void {
    const tooltipTriggerList = Array.from(
      this.elementRef.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]')
    );

    tooltipTriggerList.forEach((tooltipTriggerEl: any) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  private addClickFunctionality(): void {
    const navItems = this.elementRef.nativeElement.querySelectorAll('.nav-item');

    navItems.forEach((item: HTMLElement, index: number) => {
      this.renderer.listen(item, 'click', () => {
        navItems.forEach((nav: HTMLElement) => {
          this.renderer.setStyle(nav, 'background', 'transparent');
          this.renderer.removeClass(nav, 'active');
        });

        this.renderer.setStyle(item, 'background', 'rgba(44, 85, 48, 0.15)');
        this.renderer.addClass(item, 'active');

        this.createRippleEffect(item);
      });
    });
  }

  private createRippleEffect(element: HTMLElement): void {
    const ripple = this.renderer.createElement('span');

    const rippleStyles = `
      position: absolute;
      border-radius: 50%;
      background: rgba(44, 85, 48, 0.3);
      width: 20px;
      height: 20px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;

    this.renderer.setAttribute(ripple, 'style', rippleStyles);
    this.renderer.appendChild(element, ripple);

    setTimeout(() => {
      this.renderer.removeChild(element, ripple);
    }, 600);
  }

  private addTouchSupport(): void {
    const navItems = this.elementRef.nativeElement.querySelectorAll('.nav-item');

    navItems.forEach((item: HTMLElement) => {
      this.renderer.listen(item, 'touchstart', () => {
        this.renderer.setStyle(item, 'transform', 'translateY(-2px) scale(1.02)');
      });

      this.renderer.listen(item, 'touchend', () => {
        this.renderer.setStyle(item, 'transform', '');
      });
    });
  }

  private addSideIconClickFunctionality(): void {
    const sideIcons = this.elementRef.nativeElement.querySelectorAll('.side-icon-btn');

    sideIcons.forEach((icon: HTMLElement) => {
      this.renderer.listen(icon, 'click', () => {
        this.renderer.setStyle(icon, 'transform', 'scale(0.95)');
        setTimeout(() => {
          this.renderer.setStyle(icon, 'transform', '');
        }, 150);
      });
    });
  }

  private injectRippleStyles(): void {
    const style = this.renderer.createElement('style');
    const styleContent = `
      @keyframes ripple {
        to {
          transform: translate(-50%, -50%) scale(4);
          opacity: 0;
        }
      }

      .wedding-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 50vh;
        padding: 2rem;
        text-align: center;
      }

      .loading-spinner {
        font-size: 3rem;
        margin-bottom: 1rem;
        animation: pulse 1.5s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.05); }
      }

      .wedding-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 50vh;
        padding: 2rem;
        text-align: center;
      }

      .error-message {
        color: #dc3545;
        margin-bottom: 1rem;
        font-size: 1.1rem;
        max-width: 400px;
      }

      .retry-button {
        background: #007bff;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .retry-button:hover {
        background: #0056b3;
        transform: translateY(-1px);
      }

      .error-links {
        margin-top: 1rem;
        color: #666;
        font-size: 0.9rem;
      }

      .error-links a {
        color: #007bff;
        text-decoration: none;
      }

      .error-links a:hover {
        text-decoration: underline;
      }
    `;

    this.renderer.setProperty(style, 'textContent', styleContent);
    this.renderer.appendChild(document.head, style);
  }
}
