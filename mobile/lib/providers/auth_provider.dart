import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  
  bool _isAuthenticated = false;
  bool _isLoading = false;
  String? _token;
  String? _userId;
  String? _userName;

  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get token => _token;
  String? get userId => _userId;
  String? get userName => _userName;

  Future<void> login(String email, String password) async {
    try {
      _isLoading = true;
      notifyListeners();

      final response = await _authService.login(email, password);
      
      // Validate required fields
      if (response['token'] == null || response['id'] == null || response['userName'] == null) {
        throw Exception('Invalid login response data');
      }

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', response['token']);
      await prefs.setString('userId', response['id']);
      await prefs.setString('userName', response['userName']);

      _token = response['token'];
      _userId = response['id'];
      _userName = response['userName'];
      _isAuthenticated = true;

    } catch (e) {
      _isAuthenticated = false;
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> register(String name, String email, String password) async {
    try {
      _isLoading = true;
      notifyListeners();

      final response = await _authService.register(name, email, password);
      final userId = response['userId'];
      
      if (userId == null) {
        throw Exception('Registration failed - no user ID received');
      }
      
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('userId', userId);
      _userId = userId;

    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear(); // Clear all stored data
      
      // Reset all auth state
      _isAuthenticated = false;
      _token = null;
      _userId = null;
      _userName = null;
      notifyListeners();
    } catch (e) {
      throw Exception('Failed to logout: $e');
    }
  }

  Future<bool> checkAuth() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final userId = prefs.getString('userId');
    final userName = prefs.getString('userName');

    if (token != null && userId != null) {
      _token = token;
      _userId = userId;
      _userName = userName;
      _isAuthenticated = true;
      notifyListeners();
      return true;
    }

    _isAuthenticated = false;
    notifyListeners();
    return false;
  }

  Future<bool> verifyOTP(String email, String otp) async {
    try {
      _isLoading = true;
      notifyListeners();
      return await _authService.verifyOTP(email, otp);
    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> resendOTP(String email) async {
    try {
      _isLoading = true;
      notifyListeners();
      return await _authService.resendOTP(email);
    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> requestPasswordReset(String email) async {
    try {
      _isLoading = true;
      notifyListeners();
      return await _authService.requestPasswordReset(email);
    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Add this function to check login status
  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final userId = prefs.getString('userId');
    
    if (token != null && userId != null) {
      _token = token;
      _userId = userId;
      _userName = prefs.getString('userName');
      _isAuthenticated = true;
      notifyListeners();
      return true;
    }
    return false;
  }
}
