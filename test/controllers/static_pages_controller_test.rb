require 'test_helper'

class StaticPagesControllerTest < ActionController::TestCase
  test "should get home" do
    get :home
    assert_response :success
    assert_select "title", "Thermopile PJ"
  end

  test "should get help" do
    get :help
    assert_response :success
    assert_select "title", "HELP | Thermopile PJ"
  end

  test "should get about" do
    get :about
    assert_response :success
    assert_select "title", "ABOUT | Thermopile PJ"
  end

  test "should get contact" do
    get :contact
    assert_response :success
    assert_select "title", "CONTACT | Thermopile PJ"
  end
end
