<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Form\FormTypeInterface;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @UniqueEntity("username", message="Ce nom d'utilisateur existe déja")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=20)
     * @Assert\NotBlank(
     *      message="Saisissez votre nom d'utilisateur")
     * @Assert\Length(
     *      min = 3,
     *      max = 20,     
     *      minMessage = "Minimum {{ minLimit }} caractères",
     *      minMessage = "Maximum {{ maxLimit }} caractères", 
     * )
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(
     *      message="Saisissez votre adresse mail")
     * @Assert\Email(
     *     message = "L'email '{{ value }}' n'est pas valide.",
     *     checkMX = true
     * )
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $resetPassword;

    /**
     * @Assert\NotBlank(
     *      message="Saisissez votre mot de passe")
     * @Assert\Regex(
     *      pattern= "/^(?=.*\d).{6,}$/",     *      
     *      message="Minimum 6 caractères et au moins 1 chiffre"
     *)
    */
    private $plainPassword;

    /**
     * @ORM\Column(type="array")
     */
    private $roles = [];

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Save", mappedBy="user")
     */
    private $saves;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $facebookId;

    public function __construct()
    {
        $this->saves = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getResetPassword(): ?string
    {
        return $this->resetPassword;
    }

    public function setResetPassword(string $resetPassword): self
    {
        $this->resetPassword = $resetPassword;

        return $this;
    }

    public function getRoles(): ?array
    {
        return $this->roles;
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }


    public function getSaves()
    {
        return $this->saves;
    }

    public function setSaves($saves){
        $this->saves = $saves;

        return $this;
    }

    /**
     * Get the value of plainPassword
     */ 
    public function getPlainPassword()
    {
        return $this->plainPassword;
    }

    /**
     * Set the value of plainPassword
     *
     * @return  self
     */ 
    public function setPlainPassword($plainPassword)
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    public function eraseCredentials()
    {
        
    }

    public function getSalt(): ?string
    {
        return null;
    }

    public function getFacebookId(): ?int
    {
        return $this->facebookId;
    }

    public function setFacebookId(string $facebookId): self
    {
        $this->facebookId = $facebookId;

        return $this;
    }
}
