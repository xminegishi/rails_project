require 'test_helper'

class UsersSignupTest < ActionDispatch::IntegrationTest
  
  def setup
    ActionMailer::Base.deliveries.clear
  end

  test "invalid signup information" do
    get signup_path
    assert_no_difference 'User.count' do
      post users_path, user: { name: "",
                              email: "aa@example.com",
                              password: "foo",
                              password_confirmation: "foo"}
    end
    assert_template 'users/new'
    assert_select 'div#error_explanation'
    assert_select 'div.field_with_errors'
  end

  test "valid signup information with acount activation" do
    get signup_path
    assert_difference 'User.count', 1 do
      post users_path, user: { name: "example user",
                              email: "user@example.com",
                              password: "foobar",
                              password_confirmation: "foobar"}
    end
    assert_equal 1, ActionMailer::Base.deliveries.size
    user = assigns(:user)
    assert_not user.activated?
    # not activated yet
    log_in_as(user)
    assert_not is_logged_in?
    # token invalid
    get edit_account_activation_path("Invalid token")
    assert_not is_logged_in?
    # email invalid
    get edit_account_activation_path(user.activation_token, email: "wrong")
    assert_not is_logged_in?
    # token correct
    get edit_account_activation_path(user.activation_token, email: user.email)
    assert user.reload.activated?
    follow_redirect!
    assert_template 'users/show'
    assert is_logged_in?
  end
end
